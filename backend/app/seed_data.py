import logging
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models.all_models import (
    Organization,
    User,
    Asset,
    Alert,
    Incident,
    Investigation,
    EvidenceRecord,
    AgentRun,
    ApprovalRequest,
    ModuleProgress,
    AuditLog
)
from app.security.auth import hash_password

logger = logging.getLogger(__name__)


def seed_database():
    """
    Initialises schema and seeds realistic enterprise cybersecurity data.

    Safe to call on every startup:
    - create_all is idempotent (no-ops if tables exist).
    - Seed rows are only inserted when the organizations table is empty.
    - Every DB operation is inside a try/except so a failure logs a full
      traceback instead of crashing the lifespan context and killing the app.
    """

    # --- 1. Schema creation ------------------------------------------------
    # create_all is idempotent: it only creates tables that don't exist yet.
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Schema verified / created successfully.")
    except Exception as exc:
        # If we can't reach the DB at all, log and bail — the app will still
        # start so Railway's health-check endpoint can respond.
        logger.error("create_all failed — cannot reach database: %s", exc, exc_info=True)
        return

    # --- 2. Seed guard -----------------------------------------------------
    db: Session = SessionLocal()
    try:
        if db.query(Organization).first():
            logger.info("Seed data already present — skipping.")
            return

        logger.info("Seeding initial ThreatGuard AI enterprise dataset...")

        # 2a. Organisation
        org = Organization(
            name="Global Defense Financial Corporation",
            slug="global-defense-financial",
            tier="Enterprise Tier 1",
            posture_score=78.5
        )
        db.add(org)
        db.flush()   # Assign org.id without committing so we can FK-reference it
                     # in the same transaction; avoids partial-commit on restart.

        # 2b. Users
        admin_user = User(
            org_id=org.id,
            email="admin@threatguard.ai",
            full_name="Esha Amir Choudhary",
            hashed_password=hash_password("admin123"),
            role="Super Administrator"
        )
        lead_engineer = User(
            org_id=org.id,
            email="kahaf@threatguard.ai",
            full_name="Kahaf",
            hashed_password=hash_password("admin123"),
            role="Organization Administrator"
        )
        db.add_all([admin_user, lead_engineer])

        # 2c. Assets
        assets = [
            Asset(org_id=org.id, name="core-payment-gateway-01",    asset_type="API Gateway",        identifier="api.payments.corp",      criticality="Critical", ip_address="10.14.20.10",    domain="application-security"),
            Asset(org_id=org.id, name="prod-db-cluster-eu",         asset_type="Database",           identifier="psql-cluster.internal",  criticality="Critical", ip_address="10.14.40.15",    domain="cloud-security"),
            Asset(org_id=org.id, name="corp-ad-domain-controller",  asset_type="Domain Controller",  identifier="DC01.CORP.LOCAL",        criticality="Critical", ip_address="10.14.10.5",     domain="identity-security"),
            Asset(org_id=org.id, name="bastion-jump-host-us",       asset_type="Server",             identifier="bastion-us-east.corp",   criticality="High",     ip_address="54.210.88.12",   domain="network-security"),
            Asset(org_id=org.id, name="exec-laptop-macbook-pro",    asset_type="Endpoint",           identifier="MAC-C02D189",            criticality="Medium",   ip_address="192.168.1.104",  domain="endpoint-security"),
        ]
        db.add_all(assets)

        # 2d. Alerts
        alerts = [
            Alert(
                org_id=org.id, domain="threat-intelligence",
                title="Suspicious C2 Beaconing to Known APT29 Infrastructure",
                description="High-frequency outbound HTTPS beaconing detected to bulletproof IP 185.220.101.5 associated with Cozy Bear campaigns.",
                severity="Critical", status="Active",
                source="AbuseIPDB & Flow Telemetry", indicator="185.220.101.5"
            ),
            Alert(
                org_id=org.id, domain="soc",
                title="Kerberoasting & High-Volume Ticket Request Anomaly",
                description="Multiple SPN ticket requests observed for sensitive service accounts within 90 seconds from host WIN-DEV-08.",
                severity="Critical", status="Active",
                source="Active Directory Event ID 4769", indicator="svc-backup-admin"
            ),
            Alert(
                org_id=org.id, domain="vulnerabilities",
                title="Zero-Day RCE Exploit in Edge Firewall (CVE-2024-21413)",
                description="NVD CVSS v3.1 score 9.8 with actively weaponized EPSS probability 0.785 affecting public bastion listener.",
                severity="Critical", status="Active",
                source="NVD Vulnerability Feed", indicator="CVE-2024-21413"
            ),
            Alert(
                org_id=org.id, domain="phishing",
                title="Deceptive Typosquat Phishing Link Targetting Single-Sign-On",
                description="Domain evil-invoice-phish.net registered with Let's Encrypt SSL certificate mimicking corporate SSO portal.",
                severity="High", status="Investigating",
                source="URLhaus & Mail Gateway", indicator="evil-invoice-phish.net"
            ),
            Alert(
                org_id=org.id, domain="cloud-security",
                title="Publicly Readable S3 Storage Bucket with Audit Logs",
                description="Bucket s3-internal-audit-backup has ACL set to AllUsers with READ permissions enabled.",
                severity="High", status="Active",
                source="AWS CloudTrail / CSPM", indicator="s3-internal-audit-backup"
            ),
            Alert(
                org_id=org.id, domain="ai-security",
                title="Prompt Injection Attack Vector Detected on Internal Copilot",
                description="Adversarial prompt with system-prompt extraction instruction submitted to customer support LLM.",
                severity="Medium", status="Active",
                source="AI Guardrails Sensor", indicator="LLM-Input-Stream-39"
            ),
        ]
        db.add_all(alerts)

        # 2e. Incidents
        incidents = [
            Incident(
                org_id=org.id,
                title="INC-8492: Multi-Stage C2 Beaconing and Lateral Movement",
                domain="soc", priority="Critical", status="Open",
                assigned_to="AI SOC Orchestrator",
                mttd_minutes=14, mttr_minutes=42,
                root_cause="Phishing credential harvest followed by Cobalt Strike beacon execution"
            ),
            Incident(
                org_id=org.id,
                title="INC-8490: Public Cloud Asset Exposure Remediation",
                domain="cloud-security", priority="High", status="In Progress",
                assigned_to="Cloud Security Assistant",
                mttd_minutes=8, mttr_minutes=25,
                root_cause="Misconfigured Terraform deployment script without S3 bucket encryption enforce"
            ),
        ]
        db.add_all(incidents)

        # 2f. Demo investigation
        demo_inv = Investigation(
            org_id=org.id,
            indicator="malicious-c2-update.org",
            indicator_type="domain",
            title="Demonstration Scenario: Suspicious Domain Investigation",
            status="Waiting Approval",
            risk_score=88.5,
            severity="Critical",
            verdict="Malicious Threat Indicator Confirmed",
            evidence_summary=(
                "Autonomous multi-agent correlation confirms domain resolves to bulletproof "
                "Russian IP 185.220.101.5 with active Cobalt Strike C2 payload delivery."
            ),
            mitre_technique="T1071.001 - Web Protocols C2",
            threat_actor="APT29 (Cozy Bear)"
        )
        db.add(demo_inv)
        db.flush()   # Assign demo_inv.id before creating child rows

        # Evidence records
        db.add_all([
            EvidenceRecord(
                investigation_id=demo_inv.id,
                source="AbuseIPDB Global Sensor Network",
                factor="Threat Reputation (35%)",
                score_contribution=32.2, confidence=0.95,
                finding="92% abuse confidence score. 214 abuse complaints reported for port scanning and SSH brute force in past 30 days."
            ),
            EvidenceRecord(
                investigation_id=demo_inv.id,
                source="URLhaus Malware URL Database",
                factor="Evidence Weight (25%)",
                score_contribution=22.0, confidence=0.92,
                finding="Active URL distributing payload-update.bin tagged as Cobalt Strike Beacon variant."
            ),
            EvidenceRecord(
                investigation_id=demo_inv.id,
                source="National Threat Telemetry Stream",
                factor="Indicator Recency (15%)",
                score_contribution=12.75, confidence=0.90,
                finding="Egress flows observed beaconing every 300 seconds from host WIN-DEV-08 within the last 2 hours."
            ),
            EvidenceRecord(
                investigation_id=demo_inv.id,
                source="MITRE ATT&CK Matrix Correlation",
                factor="Related Threat Associations (15%)",
                score_contribution=13.5, confidence=0.90,
                finding="TTPs match APT29 Cozy Bear campaign infrastructure T1071.001 and T1566.002."
            ),
            EvidenceRecord(
                investigation_id=demo_inv.id,
                source="ThreatGuard Sensor Provenance",
                factor="Source Reliability (10%)",
                score_contribution=9.5, confidence=0.98,
                finding="High-integrity dual cryptographic signature verification across internal and external sensors."
            ),
        ])

        # Agent runs
        db.add_all([
            AgentRun(
                investigation_id=demo_inv.id,
                agent_name="Central AI Supervisor", status="Completed",
                logs="Central Supervisor validated input 'malicious-c2-update.org'. Selected IOC Investigation Agent and Evidence Correlation Agent for autonomous dispatch.",
                tool_calls=[{"action": "route_specialists", "domains": ["threat_intelligence", "soc"]}]
            ),
            AgentRun(
                investigation_id=demo_inv.id,
                agent_name="IOC Investigation Agent", status="Completed",
                logs="Queried MCP tools check_domain_intelligence and check_ip_reputation. Retrieved WHOIS privacy shield, fast-flux DNS records, and URLhaus blacklist status.",
                tool_calls=[{"tool": "check_domain_intelligence", "domain": "malicious-c2-update.org"}]
            ),
            AgentRun(
                investigation_id=demo_inv.id,
                agent_name="Threat Actor Research Agent", status="Completed",
                logs="Attributed infrastructure to APT29 (Cozy Bear). Match confidence: 91%. Correlated with C2 server fingerprint.",
                tool_calls=[{"tool": "mitre_attribution_lookup", "adversary": "APT29"}]
            ),
            AgentRun(
                investigation_id=demo_inv.id,
                agent_name="Evidence Correlation Agent", status="Completed",
                logs="Built 5-node forensic relationship graph. Risk Engine computed transparent 5-factor weighted score of 88.5 (Critical). Staged containment action for human approval.",
                tool_calls=[{"action": "compute_5_factor_risk", "score": 88.5}]
            ),
        ])

        # Pending approval (Human-in-the-Loop)
        db.add(ApprovalRequest(
            investigation_id=demo_inv.id,
            action_type="BLOCK_EGRESS_FIREWALL",
            target="malicious-c2-update.org",
            description=(
                "Proposed High-Impact Remediation: Block all outbound traffic on perimeter "
                "Palo Alto / Fortinet firewalls to 'malicious-c2-update.org' and resolve IP '185.220.101.5'."
            ),
            impact_level="High", status="Pending",
            requester_agent="Remediation Planning Agent"
        ))

        # 2g. Module progress for all 12 domains
        domains_progress = [
            ("threat-intelligence",   "Threat Intelligence",           84.0, 42, 50),
            ("soc",                   "SOC Operations",                76.0, 19, 25),
            ("vulnerabilities",       "Vulnerability Management",      68.0, 34, 50),
            ("application-security",  "Application & API Security",    72.0, 18, 25),
            ("cloud-security",        "Cloud Security (CSPM)",         65.0, 26, 40),
            ("identity-security",     "Identity & Access (ITDR)",      81.0, 32, 40),
            ("phishing",              "Email & Phishing Intelligence",  88.0, 44, 50),
            ("endpoint-security",     "Endpoint & Malware (EDR)",      79.0, 31, 39),
            ("network-security",      "Network Intelligence (NDR)",    74.0, 22, 30),
            ("supply-chain",          "Supply Chain & SBOM",           62.0, 18, 29),
            ("ai-security",           "AI & Agent Security",           91.0, 20, 22),
            ("governance",            "GRC & Incident Response",       83.0, 25, 30),
        ]
        for d_id, d_name, pct, verified, total in domains_progress:
            db.add(ModuleProgress(
                org_id=org.id, domain=d_id, name=d_name,
                completion_percentage=pct,
                verified_findings=verified,
                total_findings=total
            ))

        # 2h. Audit log
        db.add(AuditLog(
            org_id=org.id,
            user_name="System",
            action="PLATFORM_INITIALIZATION",
            resource="ThreatGuard Core",
            details="Enterprise multi-tenant workspace initialized with 12 cybersecurity modules."
        ))

        # --- Single atomic commit for the entire seed -----------------------
        # Using flush() above means FKs are resolved in memory;
        # this single commit either saves everything or rolls back everything.
        db.commit()
        logger.info("Database seeding completed successfully.")

    except Exception as exc:
        db.rollback()
        # Re-raise so main.py's lifespan wrapper can log the full traceback.
        # The app will still start; only the seed data will be missing.
        logger.error("seed_database() encountered an error and rolled back: %s", exc, exc_info=True)
        raise
    finally:
        db.close()
