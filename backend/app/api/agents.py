from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.all_models import AgentRun, ApprovalRequest, AuditLog, User
from app.schemas.all_schemas import AgentRunOut, ApprovalOut
from app.security.auth import get_current_user

router = APIRouter(prefix="/agents", tags=["Multi-Agent System & Governance"])

@router.get("/runs", response_model=List[AgentRunOut])
def list_agent_runs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(AgentRun).order_by(AgentRun.created_at.desc()).limit(limit).all()

@router.get("/approvals", response_model=List[ApprovalOut])
def list_approvals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ApprovalRequest).order_by(ApprovalRequest.requested_at.desc()).all()

@router.post("/approvals/{approval_id}/decide")
def decide_approval(
    approval_id: str,
    action: str,  # "approve" or "reject"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
        
    approval.status = "Approved" if action.lower() == "approve" else "Rejected"
    approval.approved_by = current_user.full_name
    approval.decided_at = datetime.now(timezone.utc)
    
    audit = AuditLog(
        org_id=current_user.org_id,
        user_name=current_user.full_name,
        action=f"APPROVAL_{approval.status.upper()}",
        resource=f"ApprovalRequest:{approval.id}",
        details=f"Decision: {approval.status} for action {approval.action_type} targeting {approval.target}."
    )
    db.add(audit)
    db.commit()
    
    return {"status": approval.status, "decided_at": approval.decided_at}
