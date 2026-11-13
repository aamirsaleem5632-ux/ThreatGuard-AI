import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    tier = Column(String(50), default="Enterprise")
    posture_score = Column(Float, default=78.5)
    created_at = Column(DateTime, default=utc_now)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="organization", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="organization", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="organization", cascade="all, delete-orphan")
    investigations = relationship("Investigation", back_populates="organization", cascade="all, delete-orphan")
    module_progress = relationship("ModuleProgress", back_populates="organization", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="Security Analyst")  # Super Administrator, Security Analyst, etc.
    is_active = Column(Boolean, default=True)
    account_status = Column(String(50), default="active")  # active, suspended, pending_verification
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="users")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(80), nullable=False)  # Server, Cloud Instance, API Gateway, Endpoint, DB
    identifier = Column(String(255), nullable=False)
    criticality = Column(String(30), default="High")  # Critical, High, Medium, Low
    status = Column(String(50), default="Monitored")
    domain = Column(String(80), default="soc")
    ip_address = Column(String(80), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    organization = relationship("Organization", back_populates="assets")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    domain = Column(String(80), nullable=False, index=True)  # threat_intelligence, soc, vulnerabilities, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(30), default="Medium")  # Critical, High, Medium, Low
    status = Column(String(50), default="Active")    # Active, Investigating, Mitigated, Closed
    source = Column(String(100), default="EDR / SIEM Sensor")
    indicator = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    organization = relationship("Organization", back_populates="alerts")

class AlertReadReceipt(Base):
    __tablename__ = "alert_read_receipts"
    __table_args__ = (
        UniqueConstraint("user_id", "alert_id", name="uq_alert_read_receipt_user_alert"),
    )

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    alert_id = Column(String(36), ForeignKey("alerts.id"), nullable=False, index=True)
    read_at = Column(DateTime, default=utc_now, nullable=False)

class ActivityReward(Base):
    __tablename__ = "activity_rewards"
    __table_args__ = (
        UniqueConstraint(
            "org_id",
            "user_id",
            "activity_type",
            "activity_key",
            name="uq_activity_reward_user_activity",
        ),
    )

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    activity_type = Column(String(50), nullable=False)
    activity_key = Column(String(64), nullable=False)
    points = Column(Integer, nullable=False)
    awarded_at = Column(DateTime, default=utc_now, nullable=False)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    title = Column(String(255), nullable=False)
    domain = Column(String(80), default="soc")
    priority = Column(String(30), default="High")  # P1-Critical, P2-High, P3-Medium, P4-Low
    status = Column(String(50), default="Open")     # Open, In Progress, Contained, Resolved, Closed
    assigned_to = Column(String(120), default="AI SOC Orchestrator")
    mttd_minutes = Column(Integer, default=14)
    mttr_minutes = Column(Integer, default=45)
    root_cause = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    closed_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="incidents")

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    indicator = Column(String(255), nullable=False)
    indicator_type = Column(String(50), nullable=False)  # ip, domain, url, hash
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="Queued")       # Queued, Running, Waiting Approval, Completed, Failed
    risk_score = Column(Float, default=0.0)
    severity = Column(String(30), default="Low")        # Critical, High, Medium, Low
    verdict = Column(String(100), default="Analyzing")
    evidence_summary = Column(Text, nullable=True)
    mitre_technique = Column(String(100), default="T1071 - Application Layer Protocol")
    threat_actor = Column(String(100), default="Unattributed")
    created_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="investigations")
    evidence = relationship("EvidenceRecord", back_populates="investigation", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="investigation", cascade="all, delete-orphan")
    approval_requests = relationship("ApprovalRequest", back_populates="investigation", cascade="all, delete-orphan")

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id"), nullable=False)
    source = Column(String(100), nullable=False)  # AbuseIPDB, URLhaus, NVD, MITRE, Telemetry
    factor = Column(String(100), nullable=False)  # Threat Reputation, Recency, etc.
    score_contribution = Column(Float, default=0.0)
    confidence = Column(Float, default=0.90)
    finding = Column(Text, nullable=False)
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    investigation = relationship("Investigation", back_populates="evidence")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)  # Supervisor, IOC Investigation, Threat Actor Research, etc.
    status = Column(String(50), default="Running")     # Running, Completed, Failed, Waiting Tool
    logs = Column(Text, nullable=True)
    tool_calls = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    finished_at = Column(DateTime, nullable=True)

    investigation = relationship("Investigation", back_populates="agent_runs")

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id"), nullable=False)
    action_type = Column(String(100), nullable=False)  # BLOCK_IP, QUARANTINE_HOST, REVOKE_TOKEN, ISOLATE_ENDPOINT
    target = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    impact_level = Column(String(30), default="High")
    status = Column(String(50), default="Pending")     # Pending, Approved, Rejected
    requester_agent = Column(String(100), default="Remediation Planning Agent")
    approved_by = Column(String(120), nullable=True)
    requested_at = Column(DateTime, default=utc_now)
    decided_at = Column(DateTime, nullable=True)

    investigation = relationship("Investigation", back_populates="approval_requests")

class ModuleProgress(Base):
    __tablename__ = "module_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    domain = Column(String(80), nullable=False)
    name = Column(String(120), nullable=False)
    completion_percentage = Column(Float, default=70.0)
    verified_findings = Column(Integer, default=14)
    total_findings = Column(Integer, default=20)
    last_assessment = Column(DateTime, default=utc_now)

    organization = relationship("Organization", back_populates="module_progress")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    org_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    user_name = Column(String(120), default="System")
    action = Column(String(120), nullable=False)
    resource = Column(String(120), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(80), default="127.0.0.1")
    timestamp = Column(DateTime, default=utc_now)

    organization = relationship("Organization", back_populates="audit_logs")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="password_reset_tokens")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    session_token = Column(String(255), unique=True, index=True, nullable=False)
    ip_address = Column(String(80), nullable=True)
    user_agent = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    last_activity = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="sessions")
