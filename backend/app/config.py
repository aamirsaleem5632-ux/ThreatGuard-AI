import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ThreatGuard AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./threatguard.db"
    
    # Security & Tokens
    SECRET_KEY: str = os.getenv("SECRET_KEY", "threatguard-super-secret-key-enterprise-soc-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Intelligence API Keys (optional; platform gracefully falls back to enriched threat heuristics when unset)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ABUSEIPDB_API_KEY: str = os.getenv("ABUSEIPDB_API_KEY", "")
    URLHAUS_API_KEY: str = os.getenv("URLHAUS_API_KEY", "")
    
    # Email Delivery (SMTP - optional; platform generates and logs recovery tokens in dev/airgap mode if unset)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM: str = os.getenv("EMAILS_FROM", "noreply@threatguard.ai")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://threat-guard-ai-zeta.vercel.app",
    ]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
