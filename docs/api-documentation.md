# REST API Documentation

## Authentication Endpoints
- `POST /api/auth/register`: Create organization and initial admin account.
- `POST /api/auth/login`: Authenticate and obtain JWT bearer token.
- `GET /api/auth/me`: Retrieve active user profile and roles.

## Command Center & Analytics
- `GET /api/dashboard/overview`: High-level security posture, active incidents, MTTD/MTTR.
- `GET /api/dashboard/posture-score`: 12-domain breakdown of posture indices.
- `GET /api/dashboard/module-progress`: Operational progress metrics across domains.

## Threat Intelligence & IOCs
- `POST /api/threat/check`: Query indicator (IP, Domain, URL, Hash) against AbuseIPDB & URLhaus.
- `GET /api/threat/indicators`: Search stored IOCs with filtering.

## Multi-Agent Investigations
- `POST /api/investigations`: Start a new autonomous multi-agent investigation.
- `GET /api/investigations`: List active and historical investigations.
- `GET /api/investigations/{id}`: Detailed investigation progress, evidence graph, agent timeline.
- `POST /api/investigations/{id}/approve`: Submit Human-in-the-Loop approval for mitigation action.

## Model Context Protocol (MCP)
- `GET /api/mcp/tools`: List available MCP tool definitions and schemas.
- `POST /api/mcp/execute`: Execute authorized security tool with role checking.
