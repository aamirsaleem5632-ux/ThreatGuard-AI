import hashlib

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.all_models import ActivityReward, Investigation, User

INVESTIGATION_COMPLETION_POINTS = 10
INVESTIGATION_COMPLETION = "investigation_completed"


def award_completed_investigation(
    db: Session,
    investigation: Investigation,
    user: User,
) -> bool:
    if investigation.status != "Completed":
        return False

    normalized_indicator = f"{investigation.indicator_type}:{investigation.indicator.strip().casefold()}"
    activity_key = hashlib.sha256(normalized_indicator.encode("utf-8")).hexdigest()
    existing = db.query(ActivityReward.id).filter(
        ActivityReward.org_id == user.org_id,
        ActivityReward.user_id == user.id,
        ActivityReward.activity_type == INVESTIGATION_COMPLETION,
        ActivityReward.activity_key == activity_key,
    ).first()
    if existing:
        return False

    try:
        with db.begin_nested():
            db.add(ActivityReward(
                org_id=user.org_id,
                user_id=user.id,
                activity_type=INVESTIGATION_COMPLETION,
                activity_key=activity_key,
                points=INVESTIGATION_COMPLETION_POINTS,
            ))
            db.flush()
    except IntegrityError:
        duplicate = db.query(ActivityReward.id).filter(
            ActivityReward.org_id == user.org_id,
            ActivityReward.user_id == user.id,
            ActivityReward.activity_type == INVESTIGATION_COMPLETION,
            ActivityReward.activity_key == activity_key,
        ).first()
        if duplicate:
            return False
        raise

    db.commit()
    return True
