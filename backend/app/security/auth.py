import hashlib
import hmac
import base64
import json
import time
from typing import Optional, Dict, Any
from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.all_models import User, Organization

security_scheme = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Generate PBKDF2 HMAC-SHA256 hash with deterministic salt for reproducibility."""
    salt = "threatguard_salt_2026_enterprise".encode('utf-8')
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(pwd_hash).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(hash_password(plain_password), hashed_password)

def create_access_token(data: dict, expires_in_seconds: int = 604800) -> str:
    """Generate a lightweight, cryptographically signed token (HMAC-SHA256)."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
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
        
        # Pad base64 for decoding
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
    auth_header = request.headers.get("Authorization", "")

    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()

    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        return cookie_token.removeprefix("Bearer ").strip()

    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    raw_token = extract_token(request)

    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_access_token(raw_token)

    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(User.id == payload["sub"]).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active or getattr(user, "account_status", "active") == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated or suspended."
        )

    return user
