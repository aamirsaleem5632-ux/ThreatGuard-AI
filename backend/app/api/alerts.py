from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.all_models import Alert, User
from app.schemas.all_schemas import AlertOut, AlertCreate, AlertUpdate
from app.security.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["SOC Alerts"])

@router.get("", response_model=List[AlertOut])
def list_alerts(
    domain: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Alert).filter(Alert.org_id == current_user.org_id)
    if domain:
        query = query.filter(Alert.domain == domain)
    if severity:
        query = query.filter(Alert.severity == severity)
    if status_filter:
        query = query.filter(Alert.status == status_filter)
        
    return query.order_by(Alert.created_at.desc()).limit(limit).all()

@router.post("", response_model=AlertOut)
def create_alert(
    payload: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = Alert(
        org_id=current_user.org_id,
        domain=payload.domain,
        title=payload.title,
        description=payload.description,
        severity=payload.severity,
        indicator=payload.indicator,
        source=payload.source or "Security Sensor",
        status="Active"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.get("/{alert_id}", response_model=AlertOut)
def get_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.org_id == current_user.org_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.patch("/{alert_id}", response_model=AlertOut)
def update_alert(
    alert_id: str,
    payload: AlertUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.org_id == current_user.org_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if payload.status:
        alert.status = payload.status
    if payload.severity:
        alert.severity = payload.severity
        
    db.commit()
    db.refresh(alert)
    return alert
