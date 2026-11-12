import re
import smtplib
import logging
from datetime import datetime, timezone, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.all_models import (
    User,
    Organization,
    PasswordResetToken,
    UserSession,
    AuditLog,
    ModuleProgress,
    Alert,
    utc_now,
    generate_uuid
)
from app.schemas.all_schemas import (
    Token,
    LoginRequest,
    RegisterRequest,
    UserOut,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse
)
from app.security.auth import (
    hash_password,
    verify_password,
    validate_password_strength,
    create_access_token,
    get_current_user,
    check_rate_limit,
    generate_reset_token,
    hash_token,
    extract_token
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

def validate_email_format(email: str) -> bool:
    return bool(email and EMAIL_REGEX.match(email.strip()))

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def send_smtp_reset_email(to_email: str, reset_url: str):
    """Attempt email delivery if SMTP settings are present."""
    if not settings.SMTP_HOST:
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "ThreatGuard AI - Password Reset Request"
        msg["From"] = settings.EMAILS_FROM
        msg["To"] = to_email

        text_content = f"""Hello,

You requested a password reset for your ThreatGuard AI account.
Please visit the following link within 15 minutes to reset your password:

{reset_url}

If you did not request this, please ignore this email. Your account remains secure.
"""
        html_content = f"""
        <div style="font-family: sans-serif; background: #030305; color: #ffffff; padding: 24px; border-radius: 8px;">
            <h2 style="color: #c084fc;">ThreatGuard AI Security Portal</h2>
            <p>You requested a password reset for your account.</p>
            <p style="margin: 20px 0;">
                <a href="{reset_url}" style="background: #7e22ce; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Reset Your Password
                </a>
            </p>
            <p style="color: #a1a1aa; font-size: 12px;">This link will expire in 15 minutes. If you did not make this request, you can safely ignore this message.</p>
        </div>
        """
        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_PORT == 587:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as exc:
        logger.error("Failed to dispatch password reset email via SMTP: %s", exc)
        return False

def seed_customer_org_baseline(db: Session, org_id: str, customer_name: str):
    """Seed baseline module progress & initial alert so new customer sees their own active dashboard."""
    domains = [
        ("threat-intelligence", "Threat Intelligence", 85.0, 42, 50),
        ("soc", "SOC Operations", 75.0, 18, 25),
        ("vulnerabilities", "Vulnerability Management", 70.0, 35, 50),
        ("application-security", "Application & API Security", 80.0, 20, 25),
        ("cloud-security", "Cloud Security (CSPM)", 68.0, 27, 40),
        ("identity-security", "Identity & Access (ITDR)", 82.0, 33, 40),
        ("phishing", "Email & Phishing Intelligence", 88.0, 44, 50),
        ("endpoint-security", "Endpoint & Malware (EDR)", 78.0, 31, 39),
        ("network-security", "Network Intelligence (NDR)", 72.0, 22, 30),
        ("supply-chain", "Supply Chain & SBOM", 65.0, 19, 29),
        ("ai-security", "AI & Agent Security", 90.0, 20, 22),
        ("governance", "GRC & Incident Response", 84.0, 25, 30),
    ]
    for domain, name, comp, verified, total in domains:
        db.add(ModuleProgress(
            org_id=org_id,
            domain=domain,
            name=name,
            completion_percentage=comp,
            verified_findings=verified,
            total_findings=total
        ))

    # Initial onboarding alert for customer's tenant
    db.add(Alert(
        org_id=org_id,
        domain="soc",
        title=f"Autonomous SOC Initialized for {customer_name}",
        description="Autonomous security orchestration engines and continuous threat monitoring are now active.",
        severity="Low",
        status="Active",
        source="ThreatGuard Autonomous Onboarding Agent"
    ))

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    ip_addr = get_client_ip(request)
    if not check_rate_limit(f"register:{ip_addr}", max_attempts=15, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Please wait a moment and try again."
        )

    # Validate Full Name
    full_name = payload.full_name.strip()
    if len(full_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name must be at least 2 characters long."
        )

    # Validate Email Format
    clean_email = payload.email.strip().lower()
    if not validate_email_format(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address (e.g., analyst@company.com)."
        )

    # Password Confirmation (if provided)
    if payload.confirm_password is not None and payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirmation password do not match."
        )

    # Password Strength
    is_strong, err_msg = validate_password_strength(payload.password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    # Duplicate Email Prevention
    existing = db.query(User).filter(User.email.ilike(clean_email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in instead."
        )

    # Determine Organization
    org_name = (payload.organization_name or "").strip()
    if not org_name:
        org_name = f"{full_name}'s Organization"
    
    # Generate unique slug
    base_slug = re.sub(r'[^a-z0-9]+', '-', org_name.lower()).strip('-') or "tenant"
    org_slug = f"{base_slug}-{generate_uuid()[:6]}"

    org = Organization(
        name=org_name,
        slug=org_slug,
        tier="Enterprise",
        posture_score=82.0
    )
    db.add(org)
    db.flush()

    # Create Customer User
    user = User(
        org_id=org.id,
        email=clean_email,
        full_name=full_name,
        hashed_password=hash_password(payload.password),
        role="Super Administrator",
        is_active=True,
        account_status="active"
    )
    db.add(user)
    db.flush()

    # Seed baseline domain progress & initial welcome alert for customer's tenant
    seed_customer_org_baseline(db, org.id, full_name)

    # Audit Log
    db.add(AuditLog(
        org_id=org.id,
        user_name=full_name,
        action="USER_REGISTRATION",
        resource="auth.register",
        details=f"Customer account registered for {clean_email}",
        ip_address=ip_addr
    ))

    # Create Session & Token
    expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "org_id": user.org_id,
            "name": user.full_name
        },
        expires_in_seconds=expires_in
    )

    # Record UserSession
    db.add(UserSession(
        user_id=user.id,
        session_token=hash_token(access_token),
        ip_address=ip_addr,
        user_agent=request.headers.get("User-Agent", "Unknown"),
        expires_at=datetime.now(timezone.utc) + timedelta(seconds=expires_in),
        is_active=True
    ))

    db.commit()
    db.refresh(user)

    # Set HTTP-only secure cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=expires_in,
        httponly=True,
        samesite="lax",
        path="/"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "org_id": user.org_id,
            "organization_name": org.name,
            "account_status": user.account_status,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/login", response_model=Token)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    ip_addr = get_client_ip(request)
    clean_email = payload.email.strip().lower()

    if not check_rate_limit(f"login:{clean_email}:{ip_addr}", max_attempts=15, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again after 60 seconds."
        )

    user = db.query(User).filter(User.email.ilike(clean_email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        # Log failed attempt
        if user:
            db.add(AuditLog(
                org_id=user.org_id,
                user_name=user.full_name,
                action="LOGIN_FAILURE",
                resource="auth.login",
                details="Invalid password attempt",
                ip_address=ip_addr
            ))
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password. Please verify your credentials."
        )

    if not user.is_active or getattr(user, "account_status", "active") == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated or suspended. Please contact support."
        )

    # Remember Me option: 30 days vs 7 days
    expires_in_seconds = 30 * 86400 if payload.remember_me else settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "org_id": user.org_id,
            "name": user.full_name
        },
        expires_in_seconds=expires_in_seconds
    )

    # Record UserSession in DB
    db.add(UserSession(
        user_id=user.id,
        session_token=hash_token(access_token),
        ip_address=ip_addr,
        user_agent=request.headers.get("User-Agent", "Unknown"),
        expires_at=datetime.now(timezone.utc) + timedelta(seconds=expires_in_seconds),
        is_active=True
    ))

    # Audit Log
    db.add(AuditLog(
        org_id=user.org_id,
        user_name=user.full_name,
        action="LOGIN_SUCCESS",
        resource="auth.login",
        details="Customer logged in successfully",
        ip_address=ip_addr
    ))
    db.commit()

    # Set HTTP-only secure cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=expires_in_seconds,
        httponly=True,
        samesite="lax",
        path="/"
    )

    org = db.query(Organization).filter(Organization.id == user.org_id).first()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "org_id": user.org_id,
            "organization_name": org.name if org else "ThreatGuard Enterprise",
            "account_status": getattr(user, "account_status", "active"),
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/logout", response_model=MessageResponse)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    token = extract_token(request)
    if token:
        token_h = hash_token(token)
        session_record = db.query(UserSession).filter(UserSession.session_token == token_h).first()
        if session_record:
            session_record.is_active = False
            db.commit()

    # Clear cookie
    response.delete_cookie(key="access_token", path="/")
    return {"message": "You have been successfully logged out."}

@router.get("/me", response_model=UserOut)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == current_user.org_id).first()
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        org_id=current_user.org_id,
        account_status=getattr(current_user, "account_status", "active"),
        organization_name=org.name if org else "ThreatGuard Enterprise",
        created_at=current_user.created_at or datetime.now(timezone.utc),
        updated_at=getattr(current_user, "updated_at", None)
    )

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    ip_addr = get_client_ip(request)
    if not check_rate_limit(f"forgot:{ip_addr}", max_attempts=8, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many password reset requests. Please try again after 60 seconds."
        )

    clean_email = payload.email.strip().lower()
    if not validate_email_format(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )

    user = db.query(User).filter(User.email.ilike(clean_email)).first()
    if not user:
        # Prevent user enumeration with generic security message
        return {
            "message": "If an account with that email exists, password reset instructions have been generated.",
            "detail": "Please check your inbox or server logs."
        }

    # Invalidate previous tokens
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False
    ).update({"used": True})

    # Generate new single-use token valid for 15 minutes
    raw_token = generate_reset_token()
    token_h = hash_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_h,
        expires_at=expires_at,
        used=False
    )
    db.add(reset_record)
    db.commit()

    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}"
    email_sent = False

    if settings.SMTP_HOST:
        email_sent = send_smtp_reset_email(user.email, reset_url)

    logger.warning("==================================================")
    logger.warning("SECURE PASSWORD RESET TOKEN GENERATED FOR: %s", user.email)
    logger.warning("Reset URL: %s", reset_url)
    logger.warning("Token expires in 15 minutes at: %s UTC", expires_at.isoformat())
    logger.warning("==================================================")

    if email_sent:
        return {
            "message": "Password reset instructions have been dispatched to your email address.",
            "detail": "Please check your inbox and click the reset link within 15 minutes."
        }
    else:
        # Document email service requirement while providing direct token for development testing
        return {
            "message": "Password reset token generated and logged to backend audit console.",
            "detail": "SMTP delivery is not configured on this host. Use the generated reset link or token below to set a new password.",
            "reset_token": raw_token
        }

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    payload: ResetPasswordRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    ip_addr = get_client_ip(request)
    if not check_rate_limit(f"reset:{ip_addr}", max_attempts=10, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many reset attempts. Please wait a moment and try again."
        )

    if not payload.token or not payload.token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token is required."
        )

    # Validate matching passwords if confirm_password provided
    if payload.confirm_password is not None and payload.new_password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match."
        )

    # Validate password complexity
    is_strong, err_msg = validate_password_strength(payload.new_password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    token_h = hash_token(payload.token.strip())
    reset_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == token_h
    ).first()

    now_utc = datetime.now(timezone.utc)
    if not reset_record or reset_record.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password reset token is invalid or has already been used. Please request a new one."
        )

    # Check expiration (handle naive/aware timezone cleanly)
    rec_exp = reset_record.expires_at
    if rec_exp.tzinfo is None:
        rec_exp = rec_exp.replace(tzinfo=timezone.utc)
        
    if rec_exp < now_utc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password reset token has expired (15-minute validity). Please request a new one."
        )

    user = db.query(User).filter(User.id == reset_record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Associated customer account could not be found."
        )

    # Hash new password with bcrypt and update
    user.hashed_password = hash_password(payload.new_password)
    user.updated_at = now_utc
    reset_record.used = True

    # Invalidate all prior sessions for security
    db.query(UserSession).filter(UserSession.user_id == user.id).update({"is_active": False})

    # Audit Log
    db.add(AuditLog(
        org_id=user.org_id,
        user_name=user.full_name,
        action="PASSWORD_RESET_SUCCESS",
        resource="auth.reset-password",
        details="Customer successfully reset password via security token",
        ip_address=ip_addr
    ))

    db.commit()

    return {
        "message": "Your password has been successfully updated. You may now log in with your new credentials."
    }
