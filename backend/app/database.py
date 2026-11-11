import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

database_url = os.getenv("DATABASE_URL")
if database_url is None and not os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    database_url = settings.DATABASE_URL

database_url = (database_url or "").strip().strip("'\"").strip()

# TEMP DEBUG - remove after fixing
print(
    f"DATABASE_URL is set: {bool(database_url)}, "
    f"length: {len(database_url)}, prefix: {database_url[:13]!r}"
)

if not database_url:
    raise RuntimeError("DATABASE_URL is not set or is empty")

# --- YAHAN FIX KIYA GAYA HAI ---
# SQLAlchemy 2.1 ko explicitly batana padta hai ke psycopg (v3) use karna hai
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)
# -------------------------------

connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()