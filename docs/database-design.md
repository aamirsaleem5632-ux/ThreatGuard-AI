# Database Schema & Entity Design

## 1. Core Entity Relationship
- `organizations`: Multi-tenant boundary (`id`, `name`, `slug`, `tier`, `created_at`).
- `users`: Authenticated operators (`id`, `org_id`, `email`, `role`, `hashed_password`).
- `assets`: Monitored digital assets (`id`, `org_id`, `type`, `identifier`, `criticality`).
- `alerts`: Ingested security signals (`id`, `org_id`, `domain`, `severity`, `status`, `title`, `description`).
- `incidents`: Correlated security incidents (`id`, `org_id`, `priority`, `status`, `assigned_to`, `mttd`, `mttr`).
- `investigations`: Multi-agent investigation sessions (`id`, `org_id`, `target_indicator`, `status`, `risk_score`, `verdict`).
- `evidence_records`: Traceable forensic artifacts (`id`, `investigation_id`, `source`, `raw_payload`, `confidence`).
- `agent_runs`: Agent execution logs (`id`, `investigation_id`, `agent_name`, `status`, `tool_calls`).
- `approval_requests`: Human-in-the-Loop gating (`id`, `investigation_id`, `action_type`, `status`, `payload`).
- `audit_logs`: Immutable compliance audit trail (`id`, `user_id`, `action`, `resource`, `timestamp`).
