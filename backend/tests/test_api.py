import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.models.all_models import Investigation, User
import app.main as main_module
import app.seed_data as seed_data
from app.security.auth import hash_password
from app.services.risk_engine import RiskEngine
from app.services.gamification import award_completed_investigation

class TestThreatGuardAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original_engine = main_module.engine
        cls.original_seed_engine = seed_data.engine
        cls.original_seed_session_local = seed_data.SessionLocal
        cls.test_engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.test_session_local = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=cls.test_engine,
        )

        main_module.engine = cls.test_engine
        seed_data.engine = cls.test_engine
        seed_data.SessionLocal = cls.test_session_local
        seed_data.seed_database()

        def override_get_db():
            db = cls.test_session_local()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db

    @classmethod
    def tearDownClass(cls):
        app.dependency_overrides.pop(get_db, None)
        main_module.engine = cls.original_engine
        seed_data.engine = cls.original_seed_engine
        seed_data.SessionLocal = cls.original_seed_session_local
        cls.test_engine.dispose()

    def setUp(self):
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()

    def get_auth_headers(self, email="admin@threatguard.ai", password="admin123"):
        login_res = self.client.post("/api/auth/login", json={"email": email, "password": password})
        if login_res.status_code == 200:
            token = login_res.json()["access_token"]
            return {"Authorization": f"Bearer {token}"}
        return {}

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["platform"], "ThreatGuard AI")
        self.assertEqual(data["domains_active"], 12)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_risk_engine_calculation(self):
        result = RiskEngine.calculate_risk(92.0, 88.0, 85.0, 90.0, 95.0)
        self.assertGreaterEqual(result["score"], 88.0)
        self.assertEqual(result["severity"], "Critical")
        self.assertIn("Malicious", result["verdict"])

    def test_mcp_tools_list(self):
        # Tools list is an open integration registry
        headers = self.get_auth_headers()
        response = self.client.get("/api/mcp/tools", headers=headers)
        self.assertEqual(response.status_code, 200)
        tools = response.json()
        self.assertGreaterEqual(len(tools), 12)
        tool_names = [t["name"] for t in tools]
        self.assertIn("check_ip_reputation", tool_names)
        self.assertIn("check_domain_intelligence", tool_names)
        self.assertIn("search_vulnerability", tool_names)

    def test_unauthenticated_dashboard_rejected(self):
        # Protected route MUST reject unauthenticated requests
        response = self.client.get("/api/dashboard/overview")
        self.assertEqual(response.status_code, 401)
        self.assertIn("Authentication required", response.json()["detail"])

    def test_alert_notifications_are_authenticated_and_read_state_is_per_user(self):
        self.assertEqual(self.client.get("/api/alerts/notifications").status_code, 401)
        self.assertEqual(self.client.get("/api/alerts/stream").status_code, 401)

        headers = self.get_auth_headers()
        alerts = self.client.get("/api/alerts", headers=headers)
        self.assertEqual(alerts.status_code, 200)
        admin_alert_ids = {alert["id"] for alert in alerts.json()}
        alert_id = alerts.json()[0]["id"]

        notifications = self.client.get("/api/alerts/notifications", headers=headers)
        self.assertEqual(notifications.status_code, 200)
        notification = next(item for item in notifications.json() if item["id"] == alert_id)
        self.assertFalse(notification["is_read"])

        marked = self.client.post(f"/api/alerts/{alert_id}/read", headers=headers)
        self.assertEqual(marked.status_code, 200)
        self.assertTrue(marked.json()["is_read"])
        self.assertEqual(self.client.post(f"/api/alerts/{alert_id}/read", headers=headers).status_code, 200)

        db = self.test_session_local()
        try:
            admin = db.query(User).filter(User.email == "admin@threatguard.ai").first()
            second_user = User(
                org_id=admin.org_id,
                email="notification-second-user@enterprise-corp.com",
                full_name="Second Notification Analyst",
                hashed_password=hash_password("StrongPassword2026!"),
                role="Security Analyst",
                is_active=True,
                account_status="active",
            )
            db.add(second_user)
            db.commit()
        finally:
            db.close()

        second_user_headers = self.get_auth_headers(
            email="notification-second-user@enterprise-corp.com",
            password="StrongPassword2026!",
        )
        second_user_notifications = self.client.get(
            "/api/alerts/notifications",
            headers=second_user_headers,
        )
        self.assertEqual(second_user_notifications.status_code, 200)
        same_org_notification = next(
            item for item in second_user_notifications.json() if item["id"] == alert_id
        )
        self.assertFalse(same_org_notification["is_read"])

        customer = self.client.post(
            "/api/auth/register",
            json={
                "full_name": "Notification Isolation Analyst",
                "email": "notification-isolation@enterprise-corp.com",
                "password": "StrongPassword2026!",
                "confirm_password": "StrongPassword2026!",
                "organization_name": "Notification Isolation Org",
            },
        )
        self.assertEqual(customer.status_code, 201)
        customer_headers = {"Authorization": f"Bearer {customer.json()['access_token']}"}
        customer_notifications = self.client.get("/api/alerts/notifications", headers=customer_headers)
        self.assertEqual(customer_notifications.status_code, 200)
        self.assertEqual(len(customer_notifications.json()), 1)
        self.assertEqual(
            customer_notifications.json()[0]["title"],
            "Autonomous SOC Initialized for Notification Isolation Analyst",
        )
        customer_notification_ids = {item["id"] for item in customer_notifications.json()}
        self.assertTrue(customer_notification_ids.isdisjoint(admin_alert_ids))

    def test_gamification_points_only_follow_unique_completed_investigations(self):
        self.assertEqual(self.client.get("/api/gamification/me").status_code, 401)
        self.assertEqual(self.client.get("/api/gamification/leaderboard").status_code, 401)
        headers = self.get_auth_headers()

        db = self.test_session_local()
        try:
            user = db.query(User).filter(User.email == "admin@threatguard.ai").first()
            investigation = Investigation(
                org_id=user.org_id,
                indicator="reward-test.example",
                indicator_type="domain",
                title="Gamification award test",
                status="Waiting Approval",
            )
            db.add(investigation)
            db.commit()
            db.refresh(investigation)

            self.assertFalse(award_completed_investigation(db, investigation, user))
            investigation.status = "Completed"
            db.commit()
            self.assertTrue(award_completed_investigation(db, investigation, user))
            self.assertFalse(award_completed_investigation(db, investigation, user))
            duplicate = Investigation(
                org_id=user.org_id,
                indicator=" REWARD-TEST.EXAMPLE ",
                indicator_type="domain",
                title="Duplicate gamification award test",
                status="Completed",
            )
            db.add(duplicate)
            db.commit()
            self.assertFalse(award_completed_investigation(db, duplicate, user))
        finally:
            db.close()

        profile = self.client.get("/api/gamification/me", headers=headers)
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.json()["points"], 10)
        self.assertEqual(profile.json()["completed_investigations"], 1)
        self.assertEqual(profile.json()["level"], "Analyst I")
        self.assertEqual(profile.json()["level_progress_percent"], 10)

        leaderboard = self.client.get("/api/gamification/leaderboard", headers=headers)
        self.assertEqual(leaderboard.status_code, 200)
        self.assertEqual(leaderboard.json()[0]["points"], 10)

    def test_login_success_and_authenticated_dashboard(self):
        login_res = self.client.post(
            "/api/auth/login",
            json={"email": "admin@threatguard.ai", "password": "admin123", "remember_me": True}
        )
        self.assertEqual(login_res.status_code, 200)
        data = login_res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], "admin@threatguard.ai")
        self.assertIn("access_token", login_res.cookies)

        token = data["access_token"]
        auth_header = {"Authorization": f"Bearer {token}"}

        # Request dashboard with Bearer token
        dash_res = self.client.get("/api/dashboard/overview", headers=auth_header)
        self.assertEqual(dash_res.status_code, 200)
        dash_data = dash_res.json()
        self.assertIn("posture_score", dash_data)
        self.assertEqual(dash_data["domains_monitored"], 12)

    def test_login_incorrect_credentials(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "admin@threatguard.ai", "password": "wrongpassword123"}
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Incorrect email address or password", response.json()["detail"])

    def test_customer_registration_and_isolation(self):
        # Register new customer
        customer_email = "newcustomer@enterprise-corp.com"
        reg_payload = {
            "full_name": "Cyber Defense Lead",
            "email": customer_email,
            "password": "StrongPassword2026!",
            "confirm_password": "StrongPassword2026!",
            "organization_name": "Apex Cyber Defense"
        }
        reg_res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(reg_res.status_code, 201)
        reg_data = reg_res.json()
        self.assertIn("access_token", reg_data)
        self.assertEqual(reg_data["user"]["email"], customer_email)
        self.assertEqual(reg_data["user"]["organization_name"], "Apex Cyber Defense")

        # Test duplicate registration is rejected
        dup_res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(dup_res.status_code, 400)
        self.assertIn("already exists", dup_res.json()["detail"])

        # Test customer can view their own /auth/me
        cust_token = reg_data["access_token"]
        cust_headers = {"Authorization": f"Bearer {cust_token}"}
        me_res = self.client.get("/api/auth/me", headers=cust_headers)
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.json()
        self.assertEqual(me_data["email"], customer_email)
        self.assertEqual(me_data["organization_name"], "Apex Cyber Defense")

        # Verify customer's dashboard loads their own org data
        cust_dash = self.client.get("/api/dashboard/overview", headers=cust_headers)
        self.assertEqual(cust_dash.status_code, 200)

    def test_registration_validation_rules(self):
        # Password too short
        short_pwd = {
            "full_name": "Test Analyst",
            "email": "testshort@corp.com",
            "password": "short",
            "confirm_password": "short"
        }
        res = self.client.post("/api/auth/register", json=short_pwd)
        self.assertEqual(res.status_code, 400)
        self.assertIn("at least 8 characters", res.json()["detail"])

        # Mismatched passwords
        mismatch_pwd = {
            "full_name": "Test Analyst",
            "email": "mismatch@corp.com",
            "password": "StrongPassword2026!",
            "confirm_password": "DifferentPassword2026!"
        }
        res2 = self.client.post("/api/auth/register", json=mismatch_pwd)
        self.assertEqual(res2.status_code, 400)
        self.assertIn("do not match", res2.json()["detail"])

        # Invalid email format
        invalid_email = {
            "full_name": "Test Analyst",
            "email": "invalid-email-address",
            "password": "StrongPassword2026!"
        }
        res3 = self.client.post("/api/auth/register", json=invalid_email)
        self.assertEqual(res3.status_code, 400)
        self.assertIn("valid email", res3.json()["detail"])

    def test_forgot_password_and_reset_flow(self):
        # 1. Request reset
        forgot_res = self.client.post(
            "/api/auth/forgot-password",
            json={"email": "kahaf@threatguard.ai"}
        )
        self.assertEqual(forgot_res.status_code, 200)
        forgot_data = forgot_res.json()
        self.assertIn("reset_token", forgot_data)
        token = forgot_data["reset_token"]

        # 2. Reset password with new password
        reset_res = self.client.post(
            "/api/auth/reset-password",
            json={
                "token": token,
                "new_password": "NewSecret2026!",
                "confirm_password": "NewSecret2026!"
            }
        )
        self.assertEqual(reset_res.status_code, 200)
        self.assertIn("successfully updated", reset_res.json()["message"])

        # 3. Old password should fail
        old_login = self.client.post(
            "/api/auth/login",
            json={"email": "kahaf@threatguard.ai", "password": "admin123"}
        )
        self.assertEqual(old_login.status_code, 401)

        # 4. New password should succeed
        new_login = self.client.post(
            "/api/auth/login",
            json={"email": "kahaf@threatguard.ai", "password": "NewSecret2026!"}
        )
        self.assertEqual(new_login.status_code, 200)
        self.assertIn("access_token", new_login.json())

        # 5. Token reuse should be rejected
        reuse_res = self.client.post(
            "/api/auth/reset-password",
            json={
                "token": token,
                "new_password": "AnotherNew2026!",
                "confirm_password": "AnotherNew2026!"
            }
        )
        self.assertEqual(reuse_res.status_code, 400)
        self.assertIn("invalid or has already been used", reuse_res.json()["detail"])

    def test_logout(self):
        headers = self.get_auth_headers()
        logout_res = self.client.post("/api/auth/logout", headers=headers)
        self.assertEqual(logout_res.status_code, 200)
        self.assertIn("logged out", logout_res.json()["message"])

    def test_assistants_domains(self):
        headers = self.get_auth_headers()
        response = self.client.get("/api/assistants/domains", headers=headers)
        self.assertEqual(response.status_code, 200)
        domains = response.json()
        self.assertEqual(len(domains), 12)

    def test_graph_nodes(self):
        headers = self.get_auth_headers()
        response = self.client.get("/api/graph/nodes", headers=headers)
        self.assertEqual(response.status_code, 200)
        graph = response.json()
        self.assertGreater(len(graph["nodes"]), 0)
        self.assertGreater(len(graph["links"]), 0)

if __name__ == "__main__":
    unittest.main()
