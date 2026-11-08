# ThreatGuard AI - Autonomous AI Cybersecurity & Threat Intelligence SaaS Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Language-Python%203.11+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 1. Executive Summary & Vision

**ThreatGuard AI** is a modular enterprise cybersecurity SaaS platform engineered to monitor, investigate, correlate, and autonomously triage cyber threats through multi-agent orchestration, specialized AI copilot assistants, and standardized Model Context Protocol (MCP) integrations.

### Core Philosophy
> **"One Platform. Twelve Cybersecurity Domains. Twelve Specialized AI Assistants. One Central AI Orchestration System."**

Unlike basic dashboards or generic chat interfaces, ThreatGuard AI delivers an end-to-end autonomous security operations center (ASO). It pairs every security domain with a domain-dedicated AI assistant, unifies telemetry into a **Shared Cyber Intelligence Graph**, calculates transparent 5-factor risk scores, and mandates **Human-in-the-Loop approval** before applying destructive containment actions.

---

## 2. Team Structure & Responsibilities

| Team Member | Role | Core Technical Responsibilities |
| :--- | :--- | :--- |
| **Esha Amir Choudhary** | Frontend Development & Product Integration Lead | Next.js 14 App Router, TypeScript, Cyber Design System (#07111F, Cyan, Gold), Public Portal, 12 Domain Dashboards, Command Center, Interactive Workbench, Data Visualizations. |
| **Kahaf** | Backend Development & AI Systems Lead | FastAPI REST API, SQLAlchemy Database & Multi-Tenancy, LangGraph Multi-Agent Orchestration, MCP Server (12 Tools), 5-Factor Risk Engine, External CTI Adapters (AbuseIPDB, URLhaus, NVD, MITRE). |

---

## 3. The Twelve Cybersecurity Domains

ThreatGuard AI organizes organizational defense across twelve independent yet interconnected cybersecurity domains:

1. **Threat Intelligence & Investigation (`/threat-intelligence`)**: IOC reputation (IPs, domains, hashes), AbuseIPDB and URLhaus telemetry, adversary campaign tracking.
2. **Security Operations Center (`/soc`)**: Central alert triage, MTTR/MTTD reduction, SIEM event correlation, and tier-2 escalation queues.
3. **Vulnerability Management (`/vulnerabilities`)**: CVE intelligence, CVSS v3.1/v4.0 scoring, EPSS probability, and patch verification.
4. **Application & API Security (`/application-security`)**: OWASP Top 10 mitigation, API authentication flaw audits, and SAST/DAST telemetry.
5. **Cloud Security (`/cloud-security`)**: Cloud Security Posture Management (CSPM), CIEM over-privilege detection, and unencrypted S3 storage audits.
6. **Identity & Access Security (`/identity-security`)**: Identity Threat Detection & Response (ITDR), UEBA impossible travel, Kerberoasting detection, and MFA enforcement.
7. **Email, Phishing & Fraud Intelligence (`/phishing`)**: Domain impersonation, SPF/DKIM/DMARC header analysis, and phishing kit forensics.
8. **Endpoint, Malware & Ransomware Security (`/endpoint-security`)**: EDR telemetry, process execution trees, ransomware behavior heuristics, and sandbox validation.
9. **Network Security Intelligence (`/network-security`)**: Network Detection & Response (NDR), egress beaconing flows, DNS tunneling, and firewall drop rules.
10. **Software Supply Chain Security (`/supply-chain`)**: Software Bill of Materials (SBOM) audits, open-source dependency CVEs, and vendor risk profiles.
11. **AI & Autonomous Agent Security (`/ai-security-module`)**: LLM prompt injection defenses, agent tool permission boundaries, and data leakage guardrails.
12. **Governance, Risk, Compliance & Incident Response (`/governance`)**: NIST CSF 2.0 / ISO 27001 mapping, corporate risk registers, and incident response playbooks.

---

## 4. Multi-Agent Orchestration & Investigation State Machine

ThreatGuard AI uses a LangGraph-inspired supervisor pattern to coordinate autonomous specialist agents:

```
                  ┌───────────────────────────────┐
                  │    User Indicator / Alert     │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │    Central AI Supervisor      │
                  │   (Validates & Dispatches)    │
                  └───────────────┬───────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│   IOC Agent   │         │ Threat Actor  │         │   Evidence    │
│  (MCP Tools)  │         │ Research Agt  │         │ Correlation   │
└───────┬───────┘         └───────┬───────┘         └───────┬───────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │   5-Factor Risk Engine (0-100)│
                  │   Reputation, Evidence, Recency│
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │  Human-in-the-Loop Approval?  │
                  │  (Firewall block / quarantine)│
                  └───────┬───────────────┬───────┘
                          │ Yes           │ No
                          ▼               ▼
                 [Waiting Approval]   [Completed]
                          │ (Approved)    │
                          └───────┬───────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │   Certified Report Generator  │
                  └───────────────────────────────┘
```

---

## 5. Transparent 5-Factor Risk Scoring Formula

Unlike arbitrary LLM hallucinations, ThreatGuard AI computes risk using documented mathematical rules:

$$\text{Risk Score} = (R \times 0.35) + (E \times 0.25) + (T \times 0.15) + (A \times 0.15) + (S \times 0.10)$$

Where:
- **$R$ (Threat Reputation, 35%)**: Historical complaints and AbuseIPDB/URLhaus blacklists.
- **$E$ (Evidence Weight, 25%)**: Verified malware signatures, sandbox results, and payload hashes.
- **$T$ (Activity & Recency, 15%)**: Outbound flow proximity and telemetry frequency.
- **$A$ (Related Threat Associations, 15%)**: Correlated threat actors (e.g. APT29) and campaign TTPs.
- **$S$ (Source Reliability, 10%)**: Cryptographic dual-signature sensor provenance rating.

### Severity Bands:
- **0 - 24**: Low (Benign / Informational)
- **25 - 49**: Medium (Low-Confidence Anomaly)
- **50 - 74**: High (Suspicious Indicator)
- **75 - 100**: Critical (Confirmed Malicious Threat Vector)

---

## 6. Model Context Protocol (MCP) Standard

ThreatGuard AI features an internal MCP Server exposing twelve standardized cybersecurity tools:

1. `check_ip_reputation(ip)`: Inspect IP abuse confidence and complaints via AbuseIPDB.
2. `check_domain_intelligence(domain)`: Query WHOIS, DNS entropy, and threat reputation.
3. `check_url_intelligence(url)`: Query URLhaus and phishing kit blacklists.
4. `analyze_file_hash(hash)`: Inspect SHA256/MD5 malware signatures.
5. `search_vulnerability(cve_id)`: Query NVD for CVSS v3.1/v4.0 base scores and EPSS metrics.
6. `search_attack_techniques(query)`: Correlate MITRE ATT&CK enterprise tactics and techniques.
7. `retrieve_security_alert(alert_id)`: Ingest normalized SOC telemetry.
8. `get_investigation_details(investigation_id)`: Fetch full evidence graph and agent timeline.
9. `search_security_events(query)`: Search SIEM event streams.
10. `generate_threat_report(investigation_id)`: Synthesize executive and technical briefs.
11. `retrieve_remediation_status(target)`: Check patch verification status.
12. `retrieve_organization_security_summary()`: Return aggregate posture and operational metrics.

---

## 7. Reusable AI Skills (`skills/`)

The repository includes 16 production `SKILL.md` workflows:

- `skills/threat-intelligence/SKILL.md`
- `skills/ioc-investigation/SKILL.md`
- `skills/evidence-correlation/SKILL.md`
- `skills/soc-alert-triage/SKILL.md`
- `skills/vulnerability-assessment/SKILL.md`
- `skills/application-security/SKILL.md`
- `skills/cloud-security/SKILL.md`
- `skills/identity-security/SKILL.md`
- `skills/phishing-investigation/SKILL.md`
- `skills/malware-analysis/SKILL.md`
- `skills/network-analysis/SKILL.md`
- `skills/supply-chain-security/SKILL.md`
- `skills/ai-security/SKILL.md`
- `skills/risk-assessment/SKILL.md`
- `skills/incident-response/SKILL.md`
- `skills/report-generation/SKILL.md`

---

## 8. Demonstration Walkthrough (Section 32 Scenario)

1. Navigate to the **Investigations Workbench** (`/investigations`).
2. Input target indicator: `malicious-c2-update.org` (or `185.220.101.5`).
3. Click **"Investigate"**:
   - Central Supervisor validates input.
   - IOC Investigation Agent invokes MCP tools `check_domain_intelligence` and `check_ip_reputation`.
   - Evidence records populate with AbuseIPDB 92% confidence and URLhaus Cobalt Strike tags.
   - Threat Actor Agent attributes campaign to **APT29 (Cozy Bear)**.
   - Risk Engine computes transparent score: **88.5 / 100 (Critical)**.
   - Human-in-the-Loop gate triggers with action **BLOCK_EGRESS_FIREWALL**.
4. Click **"Approve Egress Firewall Block"**:
   - Human approval is certified, recorded in immutable audit logs, and status updates to **Completed**.
5. Switch to **"Certified Report"** tab to inspect and export the generated TLP:AMBER brief.

---

## 9. Quickstart & Installation

### Option A: Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
$env:PYTHONPATH="backend"  # PowerShell
python -m unittest backend/tests/test_api.py  # Run test suite
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build   # Production build verification
npm run dev     # Starts local server on http://localhost:3000
```

### Option B: Docker Compose
```bash
docker-compose up --build
```
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

---

## 10. Verification & Quality Assurance

- **Backend Unit & Integration Tests**: 7/7 automated tests passing in `backend/tests/test_api.py`.
- **Frontend Production Build**: 28 static pages successfully prerendered with 0 TypeScript/ESLint errors.
- **Cross-Origin Security**: Configured CORS with JWT bearer token verification.
