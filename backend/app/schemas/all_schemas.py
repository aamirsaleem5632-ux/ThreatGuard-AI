from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: Optional[str] = None
    organization_name: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: Optional[str] = None

class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
    reset_token: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    org_id: str
    account_status: Optional[str] = "active"
    organization_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Dashboard Schemas
class OverviewStats(BaseModel):
    posture_score: float
    total_active_alerts: int
    critical_alerts: int
    open_incidents: int
    investigations_running: int
    mttd_minutes: int
    mttr_minutes: int
    domains_monitored: int
    active_threat_actors: int

class PostureScoreOut(BaseModel):
    overall: float
    domain_scores: Dict[str, float]

class ModuleProgressOut(BaseModel):
    domain: str
    name: str
    completion_percentage: float
    verified_findings: int
    total_findings: int

# Threat Intelligence Schemas
class ThreatCheckRequest(BaseModel):
    indicator: str
    indicator_type: Optional[str] = None  # auto-detected if not provided

class ThreatCheckResponse(BaseModel):
    indicator: str
    indicator_type: str
    risk_score: float
    severity: str
    verdict: str
    source_reputation: Dict[str, Any]
    factors: Dict[str, float]
    mitre_attack: List[Dict[str, str]]
    threat_actor: Optional[str] = None
    evidence: List[Dict[str, Any]]
    recommendations: List[str]

# Alert & Incident Schemas
class AlertOut(BaseModel):
    id: str
    domain: str
    title: str
    description: str
    severity: str
    status: str
    source: str
    indicator: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class NotificationOut(AlertOut):
    is_read: bool

class AlertCreate(BaseModel):
    domain: str
    title: str
    description: str
    severity: str
    indicator: Optional[str] = None
    source: Optional[str] = "Manual Entry"

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None

class IncidentOut(BaseModel):
    id: str
    title: str
    domain: str
    priority: str
    status: str
    assigned_to: str
    mttd_minutes: int
    mttr_minutes: int
    root_cause: Optional[str]
    created_at: datetime
    closed_at: Optional[datetime]
    class Config:
        from_attributes = True

# Investigation Schemas
class InvestigationCreate(BaseModel):
    indicator: str
    title: Optional[str] = None

class EvidenceOut(BaseModel):
    id: str
    source: str
    factor: str
    score_contribution: float
    confidence: float
    finding: str
    raw_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    class Config:
        from_attributes = True

class AgentRunOut(BaseModel):
    id: str
    agent_name: str
    status: str
    logs: Optional[str]
    tool_calls: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    finished_at: Optional[datetime]
    class Config:
        from_attributes = True

class ApprovalOut(BaseModel):
    id: str
    action_type: str
    target: str
    description: str
    impact_level: str
    status: str
    requester_agent: str
    approved_by: Optional[str]
    requested_at: datetime
    decided_at: Optional[datetime]
    class Config:
        from_attributes = True

class InvestigationOut(BaseModel):
    id: str
    indicator: str
    indicator_type: str
    title: str
    status: str
    risk_score: float
    severity: str
    verdict: str
    evidence_summary: Optional[str]
    mitre_technique: Optional[str]
    threat_actor: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    evidence: List[EvidenceOut] = []
    agent_runs: List[AgentRunOut] = []
    approval_requests: List[ApprovalOut] = []
    class Config:
        from_attributes = True

# Assistant Schemas
class ChatRequest(BaseModel):
    message: str
    domain: Optional[str] = "general"
    history: Optional[List[Dict[str, str]]] = []
    indicator_context: Optional[str] = None

class ActivityRewardOut(BaseModel):
    activity_type: str
    points: int
    awarded_at: datetime

    class Config:
        from_attributes = True

class AchievementOut(BaseModel):
    id: str
    title: str
    description: str
    earned: bool

class GamificationProfileOut(BaseModel):
    points: int
    completed_investigations: int
    level: str
    next_level: Optional[str]
    points_to_next_level: int
    level_progress_percent: int
    achievements: List[AchievementOut]
    recent_rewards: List[ActivityRewardOut]

class LeaderboardEntryOut(BaseModel):
    rank: int
    user_id: str
    full_name: str
    points: int
    level: str

class ChatResponse(BaseModel):
    response: str
    domain: str
    suggested_actions: List[str] = []
    referenced_ioc: Optional[str] = None
    tool_calls: List[Dict[str, Any]] = []

# MCP Schemas
class MCPToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = True

class MCPToolDefinition(BaseModel):
    name: str
    description: str
    category: str
    parameters: List[MCPToolParameter]

class MCPExecuteRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

class MCPExecuteResponse(BaseModel):
    tool_name: str
    success: bool
    result: Any
    execution_time_ms: float

# Report Schemas
class ReportGenerateRequest(BaseModel):
    report_type: str  # executive, technical, compliance, incident
    investigation_id: Optional[str] = None
    domain: Optional[str] = None
