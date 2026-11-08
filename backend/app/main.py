from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.seed_data import seed_database
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.threat import router as threat_router
from app.api.alerts import router as alerts_router
from app.api.incidents import router as incidents_router
from app.api.investigations import router as investigations_router
from app.api.agents import router as agents_router
from app.api.assistants import router as assistants_router
from app.api.mcp import router as mcp_router
from app.api.reports import router as reports_router
from app.api.graph import router as graph_router
from app.api.modules import router as modules_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed database with enterprise data
    seed_database()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ThreatGuard AI - Autonomous AI Cybersecurity & Threat Intelligence SaaS Platform",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(threat_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(incidents_router, prefix=settings.API_V1_STR)
app.include_router(investigations_router, prefix=settings.API_V1_STR)
app.include_router(agents_router, prefix=settings.API_V1_STR)
app.include_router(assistants_router, prefix=settings.API_V1_STR)
app.include_router(mcp_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(graph_router, prefix=settings.API_V1_STR)
app.include_router(modules_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "Operational",
        "documentation": "/docs",
        "domains_active": 12,
        "mcp_tools_registered": 12
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "ThreatGuard AI Backend API"}
