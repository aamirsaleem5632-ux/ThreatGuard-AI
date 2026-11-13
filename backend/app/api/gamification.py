from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.all_models import ActivityReward, User
from app.schemas.all_schemas import (
    AchievementOut,
    ActivityRewardOut,
    GamificationProfileOut,
    LeaderboardEntryOut,
)
from app.security.auth import get_current_user

router = APIRouter(prefix="/gamification", tags=["Analyst Gamification"])

LEVELS = (
    (0, "Analyst I"),
    (100, "Analyst II"),
    (500, "Senior Analyst"),
    (1500, "Principal Analyst"),
)

ACHIEVEMENTS = (
    ("first-case", "First Case", "Complete your first eligible investigation.", "investigations", 1),
    ("five-cases", "Threat Hunter", "Complete five eligible investigations.", "investigations", 5),
    ("twenty-cases", "Case Veteran", "Complete twenty eligible investigations.", "investigations", 20),
    ("hundred-points", "Century", "Earn 100 points from completed investigations.", "points", 100),
    ("five-hundred-points", "High Achiever", "Earn 500 points from completed investigations.", "points", 500),
)


def analyst_level(points: int) -> tuple[str, str | None, int]:
    current_index = max(
        index for index, (threshold, _) in enumerate(LEVELS) if points >= threshold
    )
    current_level = LEVELS[current_index][1]
    if current_index == len(LEVELS) - 1:
        return current_level, None, 0
    next_threshold, next_level = LEVELS[current_index + 1]
    return current_level, next_level, next_threshold - points


def level_progress(points: int) -> int:
    current_index = max(
        index for index, (threshold, _) in enumerate(LEVELS) if points >= threshold
    )
    if current_index == len(LEVELS) - 1:
        return 100
    start = LEVELS[current_index][0]
    end = LEVELS[current_index + 1][0]
    return min(100, int((points - start) * 100 / (end - start)))


def get_user_rewards(db: Session, user: User) -> List[ActivityReward]:
    return (
        db.query(ActivityReward)
        .filter(
            ActivityReward.org_id == user.org_id,
            ActivityReward.user_id == user.id,
        )
        .order_by(ActivityReward.awarded_at.desc())
        .all()
    )


@router.get("/me", response_model=GamificationProfileOut)
def get_my_gamification_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rewards = get_user_rewards(db, current_user)
    points = sum(reward.points for reward in rewards)
    completed_investigations = sum(
        reward.activity_type == "investigation_completed" for reward in rewards
    )
    level, next_level, points_to_next_level = analyst_level(points)
    achievement_values = {
        "investigations": completed_investigations,
        "points": points,
    }

    return GamificationProfileOut(
        points=points,
        completed_investigations=completed_investigations,
        level=level,
        next_level=next_level,
        points_to_next_level=points_to_next_level,
        level_progress_percent=level_progress(points),
        achievements=[
            AchievementOut(
                id=achievement_id,
                title=title,
                description=description,
                earned=achievement_values[metric] >= threshold,
            )
            for achievement_id, title, description, metric, threshold in ACHIEVEMENTS
        ],
        recent_rewards=rewards[:10],
    )


@router.get("/leaderboard", response_model=List[LeaderboardEntryOut])
def get_organization_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    totals = (
        db.query(
            User.id.label("user_id"),
            User.full_name.label("full_name"),
            func.sum(ActivityReward.points).label("points"),
        )
        .join(ActivityReward, ActivityReward.user_id == User.id)
        .filter(
            User.org_id == current_user.org_id,
            ActivityReward.org_id == current_user.org_id,
        )
        .group_by(User.id, User.full_name)
        .order_by(func.sum(ActivityReward.points).desc(), User.full_name.asc(), User.id.asc())
        .limit(10)
        .all()
    )

    return [
        LeaderboardEntryOut(
            rank=index,
            user_id=row.user_id,
            full_name=row.full_name,
            points=row.points,
            level=analyst_level(row.points)[0],
        )
        for index, row in enumerate(totals, start=1)
    ]
