from datetime import datetime, timezone
from typing import Any
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.all_models import Investigation, User
from app.schemas.all_schemas import ReportGenerateRequest
from app.security.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reporting & Compliance"])

ALLOWED_REPORT_TYPES = {"executive", "technical", "incident", "compliance"}


def format_datetime(value: Any) -> str:
    if not value:
        return "Not recorded"
    return value.isoformat() if hasattr(value, "isoformat") else str(value)


@router.post("/generate")
def generate_report(
    payload: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report_type = (payload.report_type or "").lower().strip()

    if report_type not in ALLOWED_REPORT_TYPES:
        raise HTTPException(status_code=400, detail="Invalid report type.")

    if not payload.investigation_id:
        raise HTTPException(
            status_code=400,
            detail="Select an investigation before generating a report."
        )

    investigation = (
        db.query(Investigation)
        .options(
            selectinload(Investigation.evidence),
            selectinload(Investigation.agent_runs),
            selectinload(Investigation.approval_requests),
        )
        .filter(
            Investigation.id == payload.investigation_id,
            Investigation.org_id == current_user.org_id
        )
        .first()
    )

    if not investigation:
        raise HTTPException(
            status_code=404,
            detail="Investigation not found or access denied."
        )

    evidence_records = investigation.evidence or []
    agent_runs = investigation.agent_runs or []
    approval_records = investigation.approval_requests or []

    generated_at = datetime.now(timezone.utc)

    lines = [
        "# THREATGUARD AI - SECURITY INVESTIGATION REPORT",
        "",
        f"**Generated At:** {generated_at.strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"**Report Type:** {report_type.upper()}",
        "**Source:** Stored investigation records",
        "**Classification:** Confidential",
        "",
        "---",
        "",
        "## 1. Investigation Overview",
        "",
        f"- **Title:** {investigation.title}",
        f"- **Indicator:** {investigation.indicator}",
        f"- **Indicator Type:** {investigation.indicator_type}",
        f"- **Status:** {investigation.status}",
        f"- **Risk Score:** {investigation.risk_score}",
        f"- **Severity:** {investigation.severity}",
        f"- **Verdict:** {investigation.verdict}",
        f"- **MITRE Technique:** {investigation.mitre_technique or 'Not recorded'}",
        f"- **Threat Actor:** {investigation.threat_actor or 'Not recorded'}",
        f"- **Created At:** {format_datetime(investigation.created_at)}",
        f"- **Completed At:** {format_datetime(investigation.completed_at)}",
        "",
        "### Investigation Summary",
        investigation.evidence_summary or "No investigation summary is stored.",
        "",
        "---",
        "",
        "## 2. Evidence and Telemetry Records",
        "",
    ]

    if evidence_records:
        for index, evidence in enumerate(evidence_records, 1):
            lines.extend([
                f"### Evidence {index}",
                f"- **Source:** {evidence.source}",
                f"- **Factor:** {evidence.factor}",
                f"- **Score Contribution:** {evidence.score_contribution}",
                f"- **Confidence:** {evidence.confidence}",
                f"- **Recorded At:** {format_datetime(evidence.created_at)}",
                f"- **Finding:** {evidence.finding}",
                "",
            ])
    else:
        lines.append("No evidence records are stored for this investigation.")
        lines.append("")

    lines.extend([
        "---",
        "",
        "## 3. AI Agent Execution Records",
        "",
    ])

    if agent_runs:
        for index, agent in enumerate(agent_runs, 1):
            lines.extend([
                f"### Agent Run {index}",
                f"- **Agent:** {agent.agent_name}",
                f"- **Status:** {agent.status}",
                f"- **Started At:** {format_datetime(agent.created_at)}",
                f"- **Finished At:** {format_datetime(agent.finished_at)}",
                f"- **Logs:** {agent.logs or 'No logs stored.'}",
            ])

            if agent.tool_calls:
                lines.append(
                    "**Tool Calls:** " +
                    json.dumps(agent.tool_calls, ensure_ascii=False, default=str)
                )
            else:
                lines.append("**Tool Calls:** No tool calls stored.")

            lines.append("")
    else:
        lines.append("No agent execution records are stored.")
        lines.append("")

    lines.extend([
        "---",
        "",
        "## 4. Approval and Response Records",
        "",
    ])

    if approval_records:
        for index, approval in enumerate(approval_records, 1):
            lines.extend([
                f"### Approval Record {index}",
                f"- **Action:** {approval.action_type}",
                f"- **Target:** {approval.target}",
                f"- **Description:** {approval.description}",
                f"- **Impact Level:** {approval.impact_level}",
                f"- **Status:** {approval.status}",
                f"- **Requested By:** {approval.requester_agent}",
                f"- **Approved By:** {approval.approved_by or 'Not recorded'}",
                f"- **Requested At:** {format_datetime(approval.requested_at)}",
                f"- **Decided At:** {format_datetime(approval.decided_at)}",
                "",
            ])
    else:
        lines.append("No approval records are stored for this investigation.")
        lines.append("")

    lines.extend([
        "---",
        "",
        "## 5. Report Notes",
        "",
        "- This report is generated from records stored for the selected investigation.",
        "- Missing information is identified as not recorded; no findings are fabricated.",
        "- This is a system-generated report and is not digitally signed or legally certified.",
    ])

    report_content = "\n".join(lines)

    return {
        "title": f"{report_type.capitalize()} Report - {investigation.title}",
        "type": report_type,
        "generated_at": generated_at,
        "content": report_content,
    }
