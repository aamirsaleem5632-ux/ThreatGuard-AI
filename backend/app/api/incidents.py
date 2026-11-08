from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.models.all_models import Incident, User
from app.schemas.all_schemas import IncidentOut
from app.security.auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["SOC Incidents"])

@router.get("", response_model=List[IncidentOut])
def list_incidents(
    priority: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Incident).filter(Incident.org_id == current_user.org_id)
    if priority:
        query = query.filter(Incident.priority == priority)
    if status_filter:
        query = query.filter(Incident.status == status_filter)
        
    return query.order_by(Incident.created_at.desc()).all()

@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(Incident.id == incident_id, Incident.org_id == current_user.org_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
