from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.models.all_models import (
    Investigation,
    ApprovalRequest,
    AuditLog,
    User
)
from app.schemas.all_schemas import (
    InvestigationCreate,
    InvestigationOut,
    ApprovalOut
)
from app.services.intelligence_service import IntelligenceService
from app.services.orchestrator import MultiAgentOrchestrator
from app.security.auth import get_current_user

router = APIRouter(prefix="/investigations", tags=["Multi-Agent Investigations"])

@router.get("", response_model=List[InvestigationOut])
def list_investigations(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Investigation).filter(Investigation.org_id == current_user.org_id)
    if status_filter:
        query = query.filter(Investigation.status == status_filter)
    return query.order_by(Investigation.created_at.desc()).all()

@router.post("", response_model=InvestigationOut)
async def create_and_run_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    indicator = payload.indicator.strip()
    indicator_type = IntelligenceService.detect_indicator_type(indicator)
    title = payload.title or f"Autonomous Investigation: {indicator}"

    # Create investigation record
    investigation = Investigation(
        org_id=current_user.org_id,
        indicator=indicator,
        indicator_type=indicator_type,
        title=title,
        status="Queued",
        verdict="Initializing Agent Workflow"
    )
    db.add(investigation)
    db.commit()
    db.refresh(investigation)

    # Execute Autonomous Multi-Agent Orchestration
    completed_investigation = await MultiAgentOrchestrator.run_investigation(investigation.id, db)
    return completed_investigation

@router.get("/{investigation_id}", response_model=InvestigationOut)
def get_investigation(
    investigation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = db.query(Investigation).filter(
        Investigation.id == investigation_id,
        Investigation.org_id == current_user.org_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return inv

@router.post("/{investigation_id}/approve", response_model=InvestigationOut)
def approve_containment_action(
    investigation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = db.query(Investigation).filter(
        Investigation.id == investigation_id,
        Investigation.org_id == current_user.org_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    approval = db.query(ApprovalRequest).filter(
        ApprovalRequest.investigation_id == inv.id,
        ApprovalRequest.status == "Pending"
    ).first()
    
    if approval:
        approval.status = "Approved"
        approval.approved_by = current_user.full_name
        approval.decided_at = datetime.now(timezone.utc)
        
    inv.status = "Completed"
    inv.completed_at = datetime.now(timezone.utc)

    # Record audit log
    audit = AuditLog(
        org_id=current_user.org_id,
        user_name=current_user.full_name,
        action="APPROVAL_GRANTED",
        resource=f"Investigation:{inv.id}",
        details=f"Human Analyst {current_user.full_name} approved containment action: {approval.action_type if approval else 'BLOCK'} on target {inv.indicator}."
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return inv
