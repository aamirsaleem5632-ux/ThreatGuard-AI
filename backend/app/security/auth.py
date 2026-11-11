import hashlib
import hmac
import base64
import json
import os
import time
from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.all_models import User

security_scheme = HTTPBearer(auto_error=False)
_PASSWORD_SCHEME = "pbkdf2_sha256"
_PASSWORD_ITERATIONS = 310_000
_LEGACY_SALT = "threatguard_salt_2026_enterprise".encode("utf-8")
_LEGACY_ITERATIONS = 100_000


def hash_password(password: str) -> str:
    """Hash passwords with PBKDF2-SHA256 and a unique random salt."""
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, _PASSWORD_ITERATIONS
    )
    return "$".join((
        _PASSWORD_SCHEME,
        str(_PASSWORD_ITERATIONS),
        base64.urlsafe_b64encode(salt).decode("ascii").rstrip("="),
        base64.urlsafe_b64encode(digest).decode("ascii").rstrip("="),
    ))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify current salted hashes and legacy deterministic hashes."""
    try:
        if hashed_password.startswith(f"{_PASSWORD_SCHEME}$"):
            scheme, iterations_text, salt_text, digest_text = hashed_password.split("$", 3)
            if scheme != _PASSWORD_SCHEME:
                return False
            iterations = int(iterations_text)
            if iterations < 100_000 or iterations > 2_000_000:
                return False
            salt = base64.urlsafe_b64decode(salt_text + "=" * (-len(salt_text) % 4))
            expected = base64.urlsafe_b64decode(digest_text + "=" * (-len(digest_text) % 4))
            actual = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, iterations)
            return hmac.compare_digest(actual, expected)

        # Backward compatibility for accounts created before salted hashes.
        legacy_digest = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), _LEGACY_SALT, _LEGACY_ITERATIONS
        )
        legacy_hash = base64.b64encode(legacy_digest).decode("utf-8")
        return hmac.compare_digest(legacy_hash, hashed_password)
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict, expires_in_seconds: int = 604800) -> str:
    """Create an HMAC-SHA256 signed access token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    payload["exp"] = int(time.time()) + expires_in_seconds

    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        f"{b64_header}.{b64_payload}".encode(),
        hashlib.sha256,
    ).digest()
    b64_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{b64_header}.{b64_payload}.{b64_sig}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        b64_header, b64_payload, b64_sig = parts

        padded_header = b64_header + "=" * (-len(b64_header) % 4)
        header = json.loads(base64.urlsafe_b64decode(padded_header).decode("utf-8"))
        if header.get("alg") != "HS256" or header.get("typ") != "JWT":
            return None

        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{b64_header}.{b64_payload}".encode(),
            hashlib.sha256,
        ).digest()
        padded_sig = b64_sig + "=" * (-len(b64_sig) % 4)
        given_sig = base64.urlsafe_b64decode(padded_sig)
        if not hmac.compare_digest(expected_sig, given_sig):
            return None

        padded_payload = b64_payload + "=" * (-len(b64_payload) % 4)
        payload_data = json.loads(base64.urlsafe_b64decode(padded_payload).decode("utf-8"))
        if not isinstance(payload_data, dict) or payload_data.get("exp", 0) <= time.time():
            return None
        return payload_data
    except (ValueError, TypeError, KeyError, json.JSONDecodeError):
        return None


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Require a valid bearer token; never silently authenticate a demo account."""
    if credentials:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub") if payload else None
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user and user.is_active:
                return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication credentials missing, invalid, or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
