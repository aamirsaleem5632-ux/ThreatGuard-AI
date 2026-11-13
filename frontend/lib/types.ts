export interface OverviewStats {
  posture_score: number;
  total_active_alerts: number;
  critical_alerts: number;
  open_incidents: number;
  investigations_running: number;
  mttd_minutes: number;
  mttr_minutes: number;
  domains_monitored: number;
  active_threat_actors: number;
}

export interface PostureScoreData {
  overall: number;
  domain_scores: Record<string, number>;
}

export interface ModuleProgress {
  domain: string;
  name: string;
  completion_percentage: number;
  verified_findings: number;
  total_findings: number;
}

export interface Alert {
  id: string;
  domain: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: string;
  source: string;
  indicator?: string;
  created_at: string;
}

export interface Notification extends Alert {
  is_read: boolean;
}

export interface GamificationAchievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export interface GamificationReward {
  activity_type: string;
  points: number;
  awarded_at: string;
}

export interface GamificationProfile {
  points: number;
  completed_investigations: number;
  level: string;
  next_level: string | null;
  points_to_next_level: number;
  achievements: GamificationAchievement[];
  recent_rewards: GamificationReward[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  points: number;
  level: string;
}

export interface Incident {
  id: string;
  title: string;
  domain: string;
  priority: string;
  status: string;
  assigned_to: string;
  mttd_minutes: number;
  mttr_minutes: number;
  root_cause?: string;
  created_at: string;
}

export interface EvidenceRecord {
  id: string;
  source: string;
  factor: string;
  score_contribution: number;
  confidence: number;
  finding: string;
  created_at: string;
}

export interface AgentRun {
  id: string;
  agent_name: string;
  status: string;
  logs?: string;
  tool_calls?: any[];
  created_at: string;
}

export interface ApprovalRequest {
  id: string;
  action_type: string;
  target: string;
  description: string;
  impact_level: string;
  status: string;
  requester_agent: string;
  approved_by?: string;
  requested_at: string;
}

export interface Investigation {
  id: string;
  indicator: string;
  indicator_type: string;
  title: string;
  status: string;
  risk_score: number;
  severity: string;
  verdict: string;
  evidence_summary?: string;
  mitre_technique?: string;
  threat_actor?: string;
  created_at: string;
  evidence?: EvidenceRecord[];
  agent_runs?: AgentRun[];
  approval_requests?: ApprovalRequest[];
}

export interface MCPTool {
  name: string;
  description: string;
  category: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export interface DomainAssistant {
  id: string;
  name: string;
  specialty: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  org_id: string;
  organization_name?: string;
  account_status?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface MessageResponse {
  message: string;
  detail?: string;
  reset_token?: string;
}
