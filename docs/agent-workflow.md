# Multi-Agent Orchestration & Workflow

## 1. Supervisor Architecture
The Central Supervisor Agent receives security queries or automated alerts, inspects domain taxonomy, and orchestrates specialist agents:
- `IOC Investigation Agent`
- `Threat Actor Attribution Agent`
- `Evidence Correlation Agent`
- `SOC Triage Agent`
- `Remediation Planning Agent`

## 2. Investigation State Machine
```
[Queued] 
   │
   ▼
[Supervisor Dispatch]
   │
   ▼
[Tool Execution via MCP] 
   │
   ▼
[Evidence Graph Synthesis]
   │
   ▼
[5-Factor Risk Scoring]
   │
   ▼
[Approval Gate Needed?] ──(Yes)──> [Waiting for Human Approval] ──(Approved)──┐
   │ (No)                                                                    │
   └───────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
                             [Report Generation]
                                       │
                                       ▼
                            [Investigation Completed]
```
