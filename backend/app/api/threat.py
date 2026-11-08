from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.all_schemas import ThreatCheckRequest, ThreatCheckResponse
from app.services.intelligence_service import IntelligenceService
from app.models.all_models import Investigation, User
from app.security.auth import get_current_user

router = APIRouter(prefix="/threat", tags=["Threat Intelligence"])

@router.post("/check", response_model=ThreatCheckResponse)
async def check_threat_indicator(
    payload: ThreatCheckRequest,
    current_user: User = Depends(get_current_user)
):
    result = await IntelligenceService.check_indicator(
        indicator=payload.indicator,
        indicator_type=payload.indicator_type
    )
    return result

@router.get("/indicators")
def get_known_indicators(
    indicator_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Investigation).filter(Investigation.org_id == current_user.org_id)
    if indicator_type:
        query = query.filter(Investigation.indicator_type == indicator_type)
    if severity:
        query = query.filter(Investigation.severity == severity)
        
    investigations = query.order_by(Investigation.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": inv.id,
            "indicator": inv.indicator,
            "type": inv.indicator_type,
            "risk_score": inv.risk_score,
            "severity": inv.severity,
            "verdict": inv.verdict,
            "mitre_technique": inv.mitre_technique,
            "threat_actor": inv.threat_actor,
            "created_at": inv.created_at
        }
        for inv in investigations
    ]
