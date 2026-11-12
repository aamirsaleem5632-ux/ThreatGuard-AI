import hashlib
import hmac
import base64
import json
import time
import secrets
import logging
from collections import defaultdict
from typing import Optional, Dict, Any, Tuple
import bcrypt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.all_models import User, Organization

logger = logging.getLogger(__name__)

security_scheme = HTTPBearer(auto_error=False)

# In-memory sliding rate limiter for auth endpoints
# Stores list of timestamps for (action, identifier)
_RATE_LIMIT_STORE: Dict[str, list[float]] = defaultdict(list)

def check_rate_limit(key: str, max_attempts: int = 15, window_seconds: int = 60) -> bool:
    """Check if request exceeds rate limit. Returns True if allowed, False if exceeded."""
    now = time.time()
    cutoff = now - window_seconds
    timestamps = [t for t in _RATE_LIMIT_STORE[key] if t > cutoff]
    timestamps.append(now)
    _RATE_LIMIT_STORE[key] = timestamps
    return len(timestamps) <= max_attempts

def hash_password(password: str) -> str:
    """Generate secure bcrypt hash for password storage."""
    try:
        # bcrypt handles salts automatically
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(pwd_bytes, salt)
        return hashed.decode('utf-8')
    except Exception as exc:
        logger.warning("Bcrypt hashing failed, falling back to PBKDF2: %s", exc)
        salt_bytes = "threatguard_salt_2026_enterprise".encode('utf-8')
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt_bytes, 100000)
        return base64.b64encode(pwd_hash).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password supporting bcrypt ($2b$, $2a$, $2y$) and legacy PBKDF2 hashes."""
    if not hashed_password or not plain_password:
        return False
        
    try:
        # Check if bcrypt hash
        if hashed_password.startswith(("$2b$", "$2a$", "$2y$")):
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        pass

    # Legacy PBKDF2 fallback for existing seeded database users
    try:
        salt = "threatguard_salt_2026_enterprise".encode('utf-8')
        pwd_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        legacy_hash = base64.b64encode(pwd_hash).decode('utf-8')
        return hmac.compare_digest(legacy_hash, hashed_password)
    except Exception:
        return False

def validate_password_strength(password: str) -> Tuple[bool, str]:
    """Validate customer password complexity."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter."
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number."
    return True, ""

def generate_reset_token() -> str:
    """Generate a high-entropy, cryptographically secure password reset token."""
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    """Store tokens securely as SHA-256 hashes in database."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def create_access_token(data: dict, expires_in_seconds: Optional[int] = None) -> str:
    """Generate a lightweight, cryptographically signed token (HMAC-SHA256)."""
    if expires_in_seconds is None:
        expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    payload["jti"] = secrets.token_hex(8)
    payload["exp"] = int(time.time()) + expires_in_seconds
    
    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        f"{b64_header}.{b64_payload}".encode(),
        hashlib.sha256
    ).digest()
    b64_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{b64_header}.{b64_payload}.{b64_sig}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify access token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        b64_header, b64_payload, b64_sig = parts
        
        # Verify signature
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{b64_header}.{b64_payload}".encode(),
            hashlib.sha256
        ).digest()
        
        rem = len(b64_sig) % 4
        padded_b64_sig = b64_sig + "=" * (4 - rem) if rem else b64_sig
        given_sig = base64.urlsafe_b64decode(padded_b64_sig)
        
        if not hmac.compare_digest(expected_sig, given_sig):
            return None
        
        rem_p = len(b64_payload) % 4
        padded_payload = b64_payload + "=" * (4 - rem_p) if rem_p else b64_payload
        payload_data = json.loads(base64.urlsafe_b64decode(padded_payload).decode())
        
        if payload_data.get("exp", 0) < time.time():
            return None
            
        return payload_data
    except Exception:
        return None

def extract_token(request: Request) -> Optional[str]:
    """Extract bearer token from Authorization header or HTTP-only cookie."""
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth_header:
        if auth_header.startswith("Bearer "):
            return auth_header[7:].strip()
        return auth_header.strip()
    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        if cookie_token.startswith("Bearer "):
            return cookie_token[7:].strip()
        return cookie_token.strip()
    return None

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    Enforces authentication. Requires a valid, unexpired token via
    Authorization Bearer header or HTTP-only access_token cookie.
    Rejects unauthenticated requests with 401 Unauthorized.
    """
    raw_token = extract_token(request)
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_access_token(raw_token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active or getattr(user, "account_status", "active") == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated or suspended."
        )

    return user

def get_optional_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Returns authenticated user if valid token present, otherwise None."""
    try:
        raw_token = extract_token(request)
        if not raw_token:
            return None
        payload = decode_access_token(raw_token)
        if not payload or "sub" not in payload:
            return None
        user = db.query(User).filter(User.id == payload["sub"]).first()
        if user and user.is_active:
            return user
        return None
    except Exception:
        return None