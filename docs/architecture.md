# System Architecture & Technical Specifications

## 1. High-Level Architecture
ThreatGuard AI utilizes a decoupled, modern cloud-native architecture:
- **Frontend Layer**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
- **API & Orchestration Layer**: FastAPI (Python 3.11+), LangGraph Multi-Agent Engine, MCP Tool Provider.
- **Intelligence & Feed Adapters**: AbuseIPDB, URLhaus, NVD CVE API, MITRE ATT&CK CTI.
- **Persistence Layer**: SQLAlchemy ORM with SQLite (development) and PostgreSQL (production).
- **AI Reasoning**: Google Gemini API with fallback to deterministic cybersecurity heuristic engine.

## 2. Data Flow
1. Telemetry / Indicator Ingestion -> Fast API validation.
2. Central Supervisor dispatches investigation to specialized agents.
3. MCP Server queries normalized intelligence feeds.
4. Risk Engine computes transparent 5-factor weighted score.
5. Evidence linked to Shared Cyber Intelligence Graph.
6. Real-time updates delivered to Next.js frontend via REST/SSE.
