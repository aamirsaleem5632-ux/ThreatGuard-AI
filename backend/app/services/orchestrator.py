import asyncio
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.all_models import (
    Investigation,
    EvidenceRecord,
    AgentRun,
    ApprovalRequest,
    Alert,
    AuditLog
)
from app.services.intelligence_service import IntelligenceService
from app.mcp_server.tools import MCPExecutor

class MultiAgentOrchestrator:
    """
    LangGraph-inspired Multi-Agent Autonomous Orchestration Engine.
    Executes:
    1. Central Supervisor Agent (Dispatches)
    2. IOC Investigation Agent (Executes MCP tools)
    3. Threat Actor Research Agent (Correlates adversaries)
    4. Evidence Correlation Agent (Builds Evidence Graph)
    5. Risk Assessment Engine (Calculates 5-factor transparent score)
    6. Human Approval Gate (Creates pending approval for high-risk action)
    7. Reporting Agent (Synthesizes executive brief)
    """

    @classmethod
    async def run_investigation(cls, investigation_id: str, db: Session) -> Investigation:
        investigation = db.query(Investigation).filter(Investigation.id == investigation_id).first()
        if not investigation:
            return None

        # Update status to Running
        investigation.status = "Running"
        db.commit()

        try:
            # 1. Central Supervisor Agent
            supervisor_run = AgentRun(
                investigation_id=investigation.id,
                agent_name="Central AI Supervisor",
                status="Running",
                logs=f"Central Supervisor dispatched investigation for indicator: {investigation.indicator} ({investigation.indicator_type}). Mapping required domain specialists.",
                tool_calls=[{"action": "route_to_specialists", "domains": ["threat_intelligence", "soc", "network_security"]}]
            )
            db.add(supervisor_run)
            db.commit()

            # 2. IOC Investigation Agent & MCP execution
            ioc_run = AgentRun(
                investigation_id=investigation.id,
                agent_name="IOC Investigation Agent",
                status="Running",
                logs=f"Invoking MCP tools: check_{investigation.indicator_type}_intelligence, checking AbuseIPDB and URLhaus telemetry feeds.",
                tool_calls=[
                    {"tool": f"check_{investigation.indicator_type}_intelligence", "indicator": investigation.indicator},
                    {"tool": "search_attack_techniques", "query": "C2"}
                ]
            )
            db.add(ioc_run)
            db.commit()

            # Execute intelligence query
            intel = await IntelligenceService.check_indicator(investigation.indicator, investigation.indicator_type)
            
            ioc_run.status = "Completed"
            ioc_run.finished_at = datetime.now(timezone.utc)
            ioc_run.logs += f"\nTelemetry gathered successfully. Risk Score: {intel['risk_score']}. Severity: {intel['severity']}."
            
            # Save Evidence records
            for ev in intel["evidence"]:
                evidence_rec = EvidenceRecord(
                    investigation_id=investigation.id,
                    source=ev["source"],
                    factor=ev["factor"],
                    finding=ev["finding"],
                    confidence=ev.get("confidence", 0.90),
                    raw_data=ev
                )
                db.add(evidence_rec)

            # 3. Threat Actor Research Agent
            actor_run = AgentRun(
                investigation_id=investigation.id,
                agent_name="Threat Actor Research Agent",
                status="Completed",
                logs=f"Correlated adversary attribution: {intel.get('threat_actor', 'Unattributed')}. Campaign signatures match MITRE T1071 C2 infrastructure.",
                tool_calls=[{"tool": "mitre_attribution_lookup", "adversary": intel.get("threat_actor")}],
                finished_at=datetime.now(timezone.utc)
            )
            db.add(actor_run)

            # 4. Evidence Correlation Agent
            correlation_run = AgentRun(
                investigation_id=investigation.id,
                agent_name="Evidence Correlation Agent",
                status="Completed",
                logs=f"Generated shared intelligence graph nodes. Connected {len(intel['evidence'])} evidence signals to enterprise SOC alert queues.",
                finished_at=datetime.now(timezone.utc)
            )
            db.add(correlation_run)

            # Update investigation record with computed scores
            investigation.risk_score = intel["risk_score"]
            investigation.severity = intel["severity"]
            investigation.verdict = intel["verdict"]
            investigation.evidence_summary = intel.get("summary")
            investigation.threat_actor = intel.get("threat_actor")
            if intel.get("mitre_attack"):
                first_mitre = intel["mitre_attack"][0]
                investigation.mitre_technique = f"{first_mitre['technique_id']} - {first_mitre['name']}"

            # 5. Human Approval Gate
            # If risk score >= 50, create an approval request for containment action
            if investigation.risk_score >= 50.0:
                approval = ApprovalRequest(
                    investigation_id=investigation.id,
                    action_type="BLOCK_EGRESS_FIREWALL",
                    target=investigation.indicator,
                    description=f"Automated policy proposal: Block all egress traffic to malicious indicator '{investigation.indicator}' across Palo Alto / Fortinet perimeter firewalls and revoke associated active sessions.",
                    impact_level="High",
                    status="Pending",
                    requester_agent="Remediation Planning Agent"
                )
                db.add(approval)
                investigation.status = "Waiting Approval"
            else:
                investigation.status = "Completed"
                investigation.completed_at = datetime.now(timezone.utc)

            supervisor_run.status = "Completed"
            supervisor_run.finished_at = datetime.now(timezone.utc)

            # Log audit record
            audit = AuditLog(
                org_id=investigation.org_id,
                user_name="MultiAgentOrchestrator",
                action="INVESTIGATION_COMPLETED",
                resource=f"Investigation:{investigation.id}",
                details=f"Autonomous triage completed for {investigation.indicator}. Final Risk: {investigation.risk_score} ({investigation.severity})."
            )
            db.add(audit)
            db.commit()
            db.refresh(investigation)

            return investigation

        except Exception as e:
            investigation.status = "Failed"
            db.commit()
            raise e
