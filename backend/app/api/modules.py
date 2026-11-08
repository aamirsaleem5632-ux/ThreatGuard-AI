from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.security.auth import get_current_user
from app.models.all_models import User

router = APIRouter(prefix="/modules", tags=["Cybersecurity Domain Modules"])

MODULE_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    "threat-intelligence": {
        "title": "Threat Intelligence & Investigation",
        "description": "Collect, analyse and investigate information about suspicious indicators, malicious infrastructure, threat actors and cybersecurity events.",
        "stats": {
            "Total Investigated": 184,
            "Suspicious Indicators": 42,
            "High-Risk / Malicious": 19,
            "Feeds Connected": 4,
            "Investigation Rate": "94.2%"
        },
        "findings": [
            {"indicator": "185.220.101.5", "type": "IP", "severity": "Critical", "source": "AbuseIPDB", "status": "Active"},
            {"indicator": "malicious-c2-update.org", "type": "Domain", "severity": "Critical", "source": "URLhaus", "status": "Investigating"},
            {"indicator": "evil-invoice-phish.net", "type": "Domain", "severity": "High", "source": "Passive DNS", "status": "Mitigated"},
            {"indicator": "e3b0c44298fc1c149afbf4c8...", "type": "Hash", "severity": "Medium", "source": "Sandbox", "status": "Active"}
        ],
        "agents": ["IOC Investigation Agent", "Threat Intelligence Collection Agent", "Threat Actor Research Agent", "Evidence Correlation Agent", "Threat Analysis Agent", "Intelligence Reporting Agent"],
        "tasks": [
            {"title": "Enrich C2 indicators from campaign FIN7", "status": "In Progress", "priority": "High"},
            {"title": "Verify bulletproof ASN 49505 IP ranges", "status": "Pending", "priority": "Medium"},
            {"title": "Sync latest MITRE ATT&CK Enterprise v15 matrix", "status": "Completed", "priority": "Low"}
        ],
        "progress": 84.0
    },
    "soc": {
        "title": "Security Operations Center (SOC)",
        "description": "Centralized workspace for security alert monitoring, correlation, investigation and case management.",
        "stats": {
            "Active Alerts": 24,
            "Critical Severity": 4,
            "Open Incidents": 3,
            "MTTD": "14 mins",
            "MTTR": "42 mins"
        },
        "findings": [
            {"indicator": "INC-8492", "type": "Incident", "severity": "Critical", "source": "SIEM Correlation", "status": "In Progress"},
            {"indicator": "ALT-1094", "type": "Alert", "severity": "High", "source": "EDR Sensor", "status": "Active"},
            {"indicator": "ALT-1095", "type": "Alert", "severity": "Medium", "source": "Firewall Egress", "status": "Active"}
        ],
        "agents": ["Alert Triage Agent", "Incident Investigation Agent", "Security Event Correlation Agent", "SOC Intelligence Agent", "Response Planning Agent", "SOC Reporting Agent"],
        "tasks": [
            {"title": "Triage alert spike from DMZ segment", "status": "In Progress", "priority": "Critical"},
            {"title": "Conduct post-incident review for INC-8490", "status": "Pending", "priority": "Medium"}
        ],
        "progress": 76.0
    },
    "vulnerabilities": {
        "title": "Vulnerability Management",
        "description": "Identify, assess, prioritize and track vulnerabilities affecting authorized assets using CVSS and EPSS scoring.",
        "stats": {
            "Total CVEs Tracked": 64,
            "Critical CVSS (9+)": 7,
            "High EPSS (>0.5)": 5,
            "Remediation Rate": "68.5%",
            "Overdue Patches": 2
        },
        "findings": [
            {"indicator": "CVE-2024-21413", "type": "Vulnerability", "severity": "Critical", "source": "NVD", "status": "Patch Required"},
            {"indicator": "CVE-2023-38606", "type": "Vulnerability", "severity": "High", "source": "CISA KEV", "status": "Verifying"},
            {"indicator": "CVE-2024-3094", "type": "Vulnerability", "severity": "Critical", "source": "XZ Utils", "status": "Remediated"}
        ],
        "agents": ["Vulnerability Analysis Agent", "CVE Research Agent", "Risk Prioritization Agent", "Remediation Planning Agent", "Verification Agent"],
        "tasks": [
            {"title": "Deploy Microsoft KB5034441 patch cluster", "status": "In Progress", "priority": "Critical"},
            {"title": "Rescan perimeter bastion hosts", "status": "Pending", "priority": "High"}
        ],
        "progress": 68.0
    },
    "application-security": {
        "title": "Application & API Security",
        "description": "Identify and manage security weaknesses in web applications, software code, and API endpoints.",
        "stats": {
            "Monitored Apps": 8,
            "API Endpoints": 142,
            "OWASP Risks Flagged": 11,
            "Vulnerable Dependencies": 4,
            "Remediation Progress": "72%"
        },
        "findings": [
            {"indicator": "API-POST /auth/refresh", "type": "API Endpoint", "severity": "High", "source": "DAST Scanner", "status": "Token Flaw"},
            {"indicator": "SQLi in /catalog/search", "type": "Code Flaw", "severity": "Critical", "source": "SAST Analysis", "status": "Active"},
            {"indicator": "CORS Misconfiguration on api.subdomain", "type": "App Config", "severity": "Medium", "source": "App Scanner", "status": "Mitigated"}
        ],
        "agents": ["Code Security Analysis Agent", "API Security Agent", "OWASP Assessment Agent", "Dependency Analysis Agent", "Secure Remediation Advisor"],
        "tasks": [
            {"title": "Implement prepared statements in catalog query", "status": "In Progress", "priority": "High"},
            {"title": "Enforce strict JWT audience validation", "status": "Pending", "priority": "Medium"}
        ],
        "progress": 72.0
    },
    "cloud-security": {
        "title": "Cloud Security (CSPM & CIEM)",
        "description": "Monitor and assess cloud infrastructure, multi-cloud configurations, access permissions and cloud risks.",
        "stats": {
            "Cloud Resources": 320,
            "CSPM Findings": 18,
            "Over-Privileged Roles": 6,
            "Public Storage Buckets": 0,
            "Posture Compliance": "65.5%"
        },
        "findings": [
            {"indicator": "s3-internal-audit-backup", "type": "Cloud Asset", "severity": "High", "source": "CSPM Policy", "status": "Unencrypted at Rest"},
            {"indicator": "IAM Role AdminAccessUnbound", "type": "IAM Role", "severity": "Critical", "source": "CIEM Scanner", "status": "Investigating"},
            {"indicator": "Security Group 0.0.0.0/0 on Port 22", "type": "Firewall Rule", "severity": "Critical", "source": "Posture Audit", "status": "Remediated"}
        ],
        "agents": ["Cloud Security Assessment Agent", "Configuration Analysis Agent", "Permission Risk Agent", "Cloud Compliance Agent", "Remediation Advisor"],
        "tasks": [
            {"title": "Enable SSE-KMS encryption on backup S3 buckets", "status": "Completed", "priority": "High"},
            {"title": "Restrict IAM role trust policy to single VPC", "status": "In Progress", "priority": "High"}
        ],
        "progress": 65.5
    },
    "identity-security": {
        "title": "Identity & Access Security (ITDR)",
        "description": "Monitor identity risks, privileged accounts, authentication telemetry, and impossible travel patterns.",
        "stats": {
            "Monitored Identities": 480,
            "Privileged Accounts": 14,
            "Anomalous Logins (24h)": 3,
            "MFA Coverage": "97.8%",
            "ITDR Posture": "81%"
        },
        "findings": [
            {"indicator": "john.doe@company.org", "type": "Identity", "severity": "High", "source": "UEBA Anomaly", "status": "Impossible Travel (London / Tokyo)"},
            {"indicator": "svc-backup-admin", "type": "Service Account", "severity": "Critical", "source": "ITDR Sensor", "status": "Kerberoasting Attempt"},
            {"indicator": "Inactive admin account dormant 90d", "type": "Account", "severity": "Medium", "source": "Access Review", "status": "Pending Disable"}
        ],
        "agents": ["Identity Monitoring Agent", "Authentication Analysis Agent", "Access Review Agent", "Privilege Risk Agent", "Identity Reporting Agent"],
        "tasks": [
            {"title": "Trigger step-up MFA challenge for John Doe", "status": "Completed", "priority": "High"},
            {"title": "Rotate service account Kerberos keytab", "status": "In Progress", "priority": "Critical"}
        ],
        "progress": 81.0
    },
    "phishing": {
        "title": "Email, Phishing & Fraud Intelligence",
        "description": "Investigate suspicious emails, phishing links, domain impersonation and online brand deception.",
        "stats": {
            "Emails Analyzed": 1420,
            "Suspicious Messages": 38,
            "Phishing URLs Blocked": 19,
            "Deceptive Domains": 7,
            "Detection Rate": "98.4%"
        },
        "findings": [
            {"indicator": "evil-invoice-phish.net", "type": "Deceptive Domain", "severity": "Critical", "source": "Mail Gateway", "status": "Blocked"},
            {"indicator": "noreply@secure-banking-update.live", "type": "Sender", "severity": "High", "source": "SPF Fail", "status": "Quarantined"},
            {"indicator": "QR-Code Phishing PDF attachment", "type": "Attachment", "severity": "High", "source": "Sandbox", "status": "Purged"}
        ],
        "agents": ["Email Analysis Agent", "Phishing Investigation Agent", "URL Intelligence Agent", "Domain Analysis Agent", "Fraud Intelligence Agent"],
        "tasks": [
            {"title": "Purge phishing campaign email from 42 inboxes", "status": "Completed", "priority": "Critical"},
            {"title": "Issue brand takedown request for typosquat domain", "status": "In Progress", "priority": "High"}
        ],
        "progress": 88.0
    },
    "endpoint-security": {
        "title": "Endpoint, Malware & Ransomware Security",
        "description": "Investigate endpoint telemetry, malicious binaries, process execution trees and ransomware indicators.",
        "stats": {
            "Monitored Endpoints": 260,
            "EDR Alerts (Active)": 9,
            "Malware Samples Quarantined": 5,
            "Ransomware Signatures": "0 Active",
            "Agent Health": "99.2%"
        },
        "findings": [
            {"indicator": "powershell.exe -enc JABzAD...", "type": "Suspicious Process", "severity": "Critical", "source": "EDR Sensor", "status": "Terminated"},
            {"indicator": "payload-update.bin (SHA256)", "type": "Binary", "severity": "Critical", "source": "Malware Sandbox", "status": "Quarantined"},
            {"indicator": "vssadmin delete shadows /all /quiet", "type": "Ransomware TTP", "severity": "Critical", "source": "Behavioral Monitor", "status": "Blocked"}
        ],
        "agents": ["Endpoint Analysis Agent", "Malware Intelligence Agent", "File Reputation Agent", "Behaviour Analysis Agent", "Recovery Planning Agent"],
        "tasks": [
            {"title": "Collect forensic memory dump from host WIN-DEV-08", "status": "In Progress", "priority": "High"},
            {"title": "Deploy updated EDR heuristic policy", "status": "Completed", "priority": "Medium"}
        ],
        "progress": 79.0
    },
    "network-security": {
        "title": "Network Security Intelligence (NDR)",
        "description": "Analyse authorized network telemetry, suspicious egress connections, anomalous flows and traffic spikes.",
        "stats": {
            "Network Assets": 94,
            "Traffic Monitored (24h)": "1.4 TB",
            "Egress Anomaly Flows": 3,
            "DNS Tunneling Alerts": 1,
            "NDR Efficiency": "95.1%"
        },
        "findings": [
            {"indicator": "Periodic 5-min beaconing to 185.220.101.5:443", "type": "Network Flow", "severity": "Critical", "source": "NDR Sensor", "status": "Investigating"},
            {"indicator": "High-entropy DNS TXT queries (exfiltration)", "type": "DNS Query", "severity": "High", "source": "DNS Firewall", "status": "Sinkholed"},
            {"indicator": "SSH brute force on port 22 from internal subnet", "type": "Lateral Movement", "severity": "High", "source": "Flow Collector", "status": "Contained"}
        ],
        "agents": ["Network Monitoring Agent", "Traffic Analysis Agent", "Connection Investigation Agent", "Network Threat Correlation Agent", "Network Reporting Agent"],
        "tasks": [
            {"title": "Sinkhole command-and-control DNS queries", "status": "Completed", "priority": "Critical"},
            {"title": "Isolate compromised VLAN segment 10.14.0.0/24", "status": "In Progress", "priority": "High"}
        ],
        "progress": 74.0
    },
    "supply-chain": {
        "title": "Software Supply Chain Security (SBOM)",
        "description": "Assess risks in open-source dependencies, third-party libraries, container images and vendor components.",
        "stats": {
            "Packages Monitored": 1840,
            "Vulnerable Packages": 12,
            "Critical SBOM Findings": 2,
            "Vendor Profiles Tracked": 28,
            "Compliance Score": "62.0%"
        },
        "findings": [
            {"indicator": "npm: lodash@4.17.15 (Prototype Pollution)", "type": "NPM Package", "severity": "High", "source": "SBOM Audit", "status": "Upgrade Needed"},
            {"indicator": "pypi: requests-mock-tampered (Typosquat)", "type": "PyPI Package", "severity": "Critical", "source": "Dependency Scan", "status": "Blacklisted"},
            {"indicator": "Vendor SaaS API - TLS 1.1 Outdated", "type": "Vendor Risk", "severity": "Medium", "source": "Vendor Review", "status": "Notified"}
        ],
        "agents": ["Dependency Analysis Agent", "Package Intelligence Agent", "SBOM Analysis Agent", "Supplier Risk Agent", "Supply Chain Reporting Agent"],
        "tasks": [
            {"title": "Pin verified lodash>=4.17.21 in package-lock", "status": "In Progress", "priority": "High"},
            {"title": "Audit CI/CD pipeline GitHub action signatures", "status": "Pending", "priority": "Medium"}
        ],
        "progress": 62.0
    },
    "ai-security": {
        "title": "AI & Autonomous Agent Security",
        "description": "Assess risks associated with LLM applications, autonomous agent workflows, prompt injections and data leaks.",
        "stats": {
            "Registered AI Models": 6,
            "Autonomous Agents Tracked": 12,
            "Prompt Injection Tests Passed": "99.1%",
            "Sensitive Data Leaks Prevented": 14,
            "Governance Rating": "91.0%"
        },
        "findings": [
            {"indicator": "Jailbreak / System Prompt Extraction Probe", "type": "Prompt Attack", "severity": "High", "source": "LLM Firewall", "status": "Blocked"},
            {"indicator": "Agent Tool Over-Privilege (Write DB without gate)", "type": "Agent Finding", "severity": "Critical", "source": "Agent Governance", "status": "Restricted"},
            {"indicator": "Unsanitized RAG Retrieval Context", "type": "RAG Vulnerability", "severity": "Medium", "source": "AI Security Audit", "status": "Mitigated"}
        ],
        "agents": ["AI Security Assessment Agent", "Prompt Injection Analysis Agent", "Agent Permission Review Agent", "AI Governance Agent", "AI Risk Reporting Agent"],
        "tasks": [
            {"title": "Enforce Human-in-the-Loop on database write tools", "status": "Completed", "priority": "Critical"},
            {"title": "Run OWASP for LLM Top 10 automated test suite", "status": "In Progress", "priority": "High"}
        ],
        "progress": 91.0
    },
    "governance": {
        "title": "Governance, Risk, Compliance & Incident Response",
        "description": "Manage cybersecurity policies, risk registers, framework compliance (NIST CSF 2.0 / ISO 27001), and incident playbooks.",
        "stats": {
            "Registered Risks": 28,
            "NIST CSF Posture": "83.5%",
            "Active Policies": 16,
            "Audit Controls Passing": "92%",
            "Open IR Tasks": 4
        },
        "findings": [
            {"indicator": "RSK-042: Ransomware Business Interruption", "type": "Risk Register", "severity": "High", "source": "Risk Committee", "status": "Tolerated / Insured"},
            {"indicator": "NIST CSF PR.AC-1: Identity Management", "type": "Compliance Control", "severity": "Low", "source": "Annual Audit", "status": "Compliant"},
            {"indicator": "Incident Response Plan: Tabletop Exercise", "type": "IR Workflow", "severity": "Medium", "source": "GRC Review", "status": "Scheduled Q4"}
        ],
        "agents": ["Governance Analysis Agent", "Compliance Assessment Agent", "Risk Management Agent", "Incident Response Planning Agent", "Audit Reporting Agent"],
        "tasks": [
            {"title": "Publish updated Data Retention Policy v2.4", "status": "Completed", "priority": "Medium"},
            {"title": "Conduct executive cyber simulation exercise", "status": "In Progress", "priority": "High"}
        ],
        "progress": 83.5
    }
}

@router.get("/{domain}/details")
def get_module_details(
    domain: str,
    current_user: User = Depends(get_current_user)
):
    clean_domain = domain.lower().strip()
    if clean_domain not in MODULE_DEFINITIONS:
        raise HTTPException(status_code=404, detail=f"Module '{domain}' not found in 12-domain registry")
    return MODULE_DEFINITIONS[clean_domain]
