from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.security.auth import get_current_user
from app.models.all_models import User

router = APIRouter(prefix="/graph", tags=["Shared Cyber Intelligence Graph"])

@router.get("/nodes")
def get_intelligence_graph(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    nodes = [
        {"id": "c2-domain", "label": "malicious-c2-update.org", "type": "Domain", "risk": "Critical", "color": "#F05252"},
        {"id": "ip-185", "label": "185.220.101.5", "type": "IP Address", "risk": "Critical", "color": "#F05252"},
        {"id": "ip-91", "label": "91.108.240.12", "type": "IP Address", "risk": "High", "color": "#E8A84A"},
        {"id": "actor-apt29", "label": "APT29 (Cozy Bear)", "type": "Threat Actor", "risk": "Critical", "color": "#D9AE58"},
        {"id": "malware-cobalt", "label": "Cobalt Strike Beacon", "type": "Malware Family", "risk": "Critical", "color": "#F05252"},
        {"id": "technique-t1071", "label": "T1071 - Web Protocols", "type": "MITRE Technique", "risk": "Medium", "color": "#24D6E8"},
        {"id": "technique-t1566", "label": "T1566 - Phishing Link", "type": "MITRE Technique", "risk": "High", "color": "#24D6E8"},
        {"id": "asset-db", "label": "prod-db-cluster-01", "type": "Enterprise Asset", "risk": "High", "color": "#21C7B7"},
        {"id": "cve-moniker", "label": "CVE-2024-21413", "type": "Vulnerability", "risk": "Critical", "color": "#F05252"},
        {"id": "user-victim", "label": "john.doe@company.org", "type": "Identity", "risk": "Medium", "color": "#91A0B2"},
        {"id": "incident-1", "label": "INC-8492: C2 Beaconing", "type": "SOC Incident", "risk": "Critical", "color": "#F05252"}
    ]

    links = [
        {"source": "c2-domain", "target": "ip-185", "relationship": "RESOLVES_TO"},
        {"source": "c2-domain", "target": "actor-apt29", "relationship": "ATTRIBUTED_TO"},
        {"source": "ip-185", "target": "malware-cobalt", "relationship": "HOSTS_PAYLOAD"},
        {"source": "actor-apt29", "target": "technique-t1071", "relationship": "USES_TTP"},
        {"source": "actor-apt29", "target": "technique-t1566", "relationship": "USES_TTP"},
        {"source": "c2-domain", "target": "technique-t1071", "relationship": "EXEMPLIFIES"},
        {"source": "technique-t1566", "target": "user-victim", "relationship": "TARGETED"},
        {"source": "user-victim", "target": "asset-db", "relationship": "AUTHENTICATED_FROM"},
        {"source": "cve-moniker", "target": "malware-cobalt", "relationship": "EXPLOITED_BY"},
        {"source": "incident-1", "target": "c2-domain", "relationship": "ORIGINATED_FROM"},
        {"source": "incident-1", "target": "ip-185", "relationship": "INVOLVES_IOC"}
    ]

    return {"nodes": nodes, "links": links}
