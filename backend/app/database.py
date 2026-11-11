import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

database_url = os.getenv("DATABASE_URL")
if database_url is None and not os.getenv("RAILWAY_ENVIRONMENT_NAME"):
    database_url = settings.DATABASE_URL

database_url = (database_url or "").strip().strip("'\"").strip()

if not database_url:
    raise RuntimeError("DATABASE_URL is not set or is empty")

if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
# psycopg3 (postgresql+psycopg://) does NOT accept sslmode in connect_args.
# SSL must be embedded in the DSN as a query param (?sslmode=require).
# Railway's DATABASE_URL already includes SSL params, so no connect_args needed.

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=2,
    pool_recycle=300
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
