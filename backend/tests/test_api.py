import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
import app.main as main_module
import app.seed_data as seed_data
from app.services.risk_engine import RiskEngine

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
        response = self.client.get("/api/mcp/tools")
        self.assertEqual(response.status_code, 200)
        tools = response.json()
        self.assertGreaterEqual(len(tools), 12)
        tool_names = [t["name"] for t in tools]
        self.assertIn("check_ip_reputation", tool_names)
        self.assertIn("check_domain_intelligence", tool_names)
        self.assertIn("search_vulnerability", tool_names)

    def test_dashboard_overview(self):
        response = self.client.get("/api/dashboard/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("posture_score", data)
        self.assertEqual(data["domains_monitored"], 12)

    def test_assistants_domains(self):
        response = self.client.get("/api/assistants/domains")
        self.assertEqual(response.status_code, 200)
        domains = response.json()
        self.assertEqual(len(domains), 12)

    def test_graph_nodes(self):
        response = self.client.get("/api/graph/nodes")
        self.assertEqual(response.status_code, 200)
        graph = response.json()
        self.assertGreater(len(graph["nodes"]), 0)
        self.assertGreater(len(graph["links"]), 0)

if __name__ == "__main__":
    unittest.main()
