import asyncio
import json
from datetime import datetime
from typing import AsyncIterator

from fastapi import APIRouter, Depends, Query, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import SessionLocal, get_db
from app.models.all_models import Alert, AlertReadReceipt, User
from app.schemas.all_schemas import AlertOut, AlertCreate, AlertUpdate, NotificationOut
from app.security.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["SOC Alerts"])

@router.get("/stream")
async def stream_alert_updates(
    last_event_id: Optional[str] = Header(None, alias="Last-Event-ID"),
    current_user: User = Depends(get_current_user),
):
    cursor: Optional[datetime] = None
    cursor_id = ""
    if last_event_id:
        try:
            timestamp, cursor_id = last_event_id.rsplit("|", 1)
            cursor = datetime.fromisoformat(timestamp)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid event cursor") from exc

    async def events() -> AsyncIterator[str]:
        nonlocal cursor, cursor_id
        yield "retry: 3000\n\n"
        while True:
            with SessionLocal() as stream_db:
                query = stream_db.query(Alert).filter(Alert.org_id == current_user.org_id)
                if cursor is not None:
                    query = query.filter(
                        (Alert.created_at > cursor)
                        | ((Alert.created_at == cursor) & (Alert.id > cursor_id))
                    )
                alerts = query.order_by(Alert.created_at.asc(), Alert.id.asc()).limit(100).all()

                for alert in alerts:
                    event_id = f"{alert.created_at.isoformat()}|{alert.id}"
                    data = json.dumps({
                        "id": alert.id,
                        "title": alert.title,
                        "severity": alert.severity,
                    })
                    yield f"id: {event_id}\nevent: alert\ndata: {data}\n\n"
                    cursor = alert.created_at
                    cursor_id = alert.id

            yield ": keep-alive\n\n"
            await asyncio.sleep(3)

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )

@router.get("/notifications", response_model=List[NotificationOut])
def list_notifications(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = (
        db.query(Alert, AlertReadReceipt.id)
        .outerjoin(
            AlertReadReceipt,
            and_(
                AlertReadReceipt.alert_id == Alert.id,
                AlertReadReceipt.user_id == current_user.id,
            ),
        )
        .filter(Alert.org_id == current_user.org_id)
        .order_by(Alert.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        NotificationOut(
            id=alert.id,
            domain=alert.domain,
            title=alert.title,
            description=alert.description,
            severity=alert.severity,
            status=alert.status,
            source=alert.source,
            indicator=alert.indicator,
            created_at=alert.created_at,
            is_read=receipt_id is not None,
        )
        for alert, receipt_id in rows
    ]

@router.post("/{alert_id}/read", response_model=NotificationOut)
def mark_notification_read(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.org_id == current_user.org_id,
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    receipt = db.query(AlertReadReceipt).filter(
        AlertReadReceipt.user_id == current_user.id,
        AlertReadReceipt.alert_id == alert.id,
    ).first()
    if not receipt:
        db.add(AlertReadReceipt(user_id=current_user.id, alert_id=alert.id))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            receipt = db.query(AlertReadReceipt).filter(
                AlertReadReceipt.user_id == current_user.id,
                AlertReadReceipt.alert_id == alert.id,
            ).first()
            if not receipt:
                raise

    return NotificationOut(
        id=alert.id,
        domain=alert.domain,
        title=alert.title,
        description=alert.description,
        severity=alert.severity,
        status=alert.status,
        source=alert.source,
        indicator=alert.indicator,
        created_at=alert.created_at,
        is_read=True,
    )

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
