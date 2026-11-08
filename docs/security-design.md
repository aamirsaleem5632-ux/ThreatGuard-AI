# Security & AI Governance Design

## 1. Application Security Measures
- Strong Password Hashing: Argon2 / bcrypt with per-user salt.
- JWT Session Tokens: Expiring tokens with secure cookie / Bearer authorization.
- Tenant Isolation: Every database query enforces `organization_id` tenancy checks.
- Input Sanitization: Strict Pydantic models preventing SQL injection and command execution.

## 2. AI Safety & Governance
- Prompt Injection Defense: Untrusted indicator data is isolated in structured JSON fields.
- Tool Permissions: Agents operate with read-only privileges by default.
- Human-in-the-Loop Gate: High-impact actions (blocking firewall IPs, isolating endpoints, disabling credentials) require signed approval from an authorized security analyst.
- Audit Logging: All tool invocations and user decisions are recorded in an append-only audit table.
