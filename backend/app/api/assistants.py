from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from app.schemas.all_schemas import ChatRequest, ChatResponse
from app.services.assistant_service import AssistantService, DOMAIN_SYSTEM_PROMPTS
from app.security.auth import get_current_user
from app.models.all_models import User

router = APIRouter(prefix="/assistants", tags=["Domain AI Assistants"])

@router.post("/{domain}/chat", response_model=ChatResponse)
async def chat_with_domain_assistant(
    domain: str,
    payload: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    result = await AssistantService.chat(
        message=payload.message,
        domain=domain,
        history=payload.history,
        indicator_context=payload.indicator_context
    )
    return result

@router.get("/domains")
def get_available_assistants():
    assistants = [
        {"id": "threat-intelligence", "name": "Threat Intelligence Assistant", "specialty": "IOC Enrichment, Attribution & CTI"},
        {"id": "soc", "name": "SOC Operations Assistant", "specialty": "Alert Triage, Correlation & MTTD/MTTR"},
        {"id": "vulnerabilities", "name": "Vulnerability Assistant", "specialty": "CVE Analysis, EPSS & Patching Priority"},
        {"id": "application-security", "name": "Application Security Assistant", "specialty": "OWASP Top 10, API Security & SAST"},
        {"id": "cloud-security", "name": "Cloud Security Assistant", "specialty": "CSPM, IAM Misconfigurations & Containers"},
        {"id": "identity-security", "name": "Identity Security Assistant", "specialty": "ITDR, Impossible Travel & Privileged Accounts"},
        {"id": "phishing", "name": "Phishing & Fraud Assistant", "specialty": "Domain Impersonation, Headers & Phish Kits"},
        {"id": "endpoint-security", "name": "Endpoint Security Assistant", "specialty": "EDR Telemetry, Process Trees & Ransomware"},
        {"id": "network-security", "name": "Network Security Assistant", "specialty": "NDR Anomaly, Egress Beacons & Tunneling"},
        {"id": "supply-chain", "name": "Supply Chain Security Assistant", "specialty": "SBOM Auditing, OSS CVEs & Dependency Risks"},
        {"id": "ai-security", "name": "AI & Agent Security Assistant", "specialty": "Prompt Injection, Agent Bounds & Data Leakage"},
        {"id": "governance", "name": "GRC & Incident Response Assistant", "specialty": "NIST CSF 2.0, ISO 27001 & IR Playbooks"}
    ]
    return assistants
