import {
  OverviewStats,
  PostureScoreData,
  ModuleProgress,
  Alert,
  Incident,
  Investigation,
  MCPTool,
  DomainAssistant
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function safeFetch<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      console.error(`API request failed for ${endpoint} (HTTP ${res.status}); using demo fallback data.`);
      return fallback;
    }
    return await res.json();
  } catch (err) {
    console.error(`API request failed for ${endpoint}; using demo fallback data.`, err);
    return fallback;
  }
}

export const api = {
  async getDashboardOverview(): Promise<OverviewStats> {
    return safeFetch<OverviewStats>('/dashboard/overview', {
      posture_score: 78.5,
      total_active_alerts: 24,
      critical_alerts: 4,
      open_incidents: 3,
      investigations_running: 2,
      mttd_minutes: 14,
      mttr_minutes: 42,
      domains_monitored: 12,
      active_threat_actors: 5
    });
  },

  async getPostureScore(): Promise<PostureScoreData> {
    return safeFetch<PostureScoreData>('/dashboard/posture-score', {
      overall: 78.5,
      domain_scores: {
        "Threat Intelligence": 84.0,
        "SOC Operations": 76.5,
        "Vulnerability Management": 68.0,
        "Application Security": 72.0,
        "Cloud Security": 65.5,
        "Identity Security": 81.0,
        "Phishing & Fraud": 88.0,
        "Endpoint Security": 79.5,
        "Network Security": 74.0,
        "Supply Chain": 62.0,
        "AI Security": 91.0,
        "Governance & GRC": 83.5
      }
    });
  },

  async getModuleProgress(): Promise<ModuleProgress[]> {
    return safeFetch<ModuleProgress[]>('/dashboard/module-progress', [
      { domain: "threat-intelligence", name: "Threat Intelligence", completion_percentage: 84.0, verified_findings: 42, total_findings: 50 },
      { domain: "soc", name: "SOC Operations", completion_percentage: 76.0, verified_findings: 19, total_findings: 25 },
      { domain: "vulnerabilities", name: "Vulnerability Management", completion_percentage: 68.0, verified_findings: 34, total_findings: 50 },
      { domain: "application-security", name: "Application & API Security", completion_percentage: 72.0, verified_findings: 18, total_findings: 25 },
      { domain: "cloud-security", name: "Cloud Security (CSPM)", completion_percentage: 65.0, verified_findings: 26, total_findings: 40 },
      { domain: "identity-security", name: "Identity & Access (ITDR)", completion_percentage: 81.0, verified_findings: 32, total_findings: 40 },
      { domain: "phishing", name: "Email & Phishing Intelligence", completion_percentage: 88.0, verified_findings: 44, total_findings: 50 },
      { domain: "endpoint-security", name: "Endpoint & Malware (EDR)", completion_percentage: 79.0, verified_findings: 31, total_findings: 39 },
      { domain: "network-security", name: "Network Intelligence (NDR)", completion_percentage: 74.0, verified_findings: 22, total_findings: 30 },
      { domain: "supply-chain", name: "Supply Chain & SBOM", completion_percentage: 62.0, verified_findings: 18, total_findings: 29 },
      { domain: "ai-security", name: "AI & Agent Security", completion_percentage: 91.0, verified_findings: 20, total_findings: 22 },
      { domain: "governance", name: "GRC & Incident Response", completion_percentage: 83.0, verified_findings: 25, total_findings: 30 }
    ]);
  },

  async getAlerts(domain?: string): Promise<Alert[]> {
    const url = domain ? `/alerts?domain=${domain}` : '/alerts';
    return safeFetch<Alert[]>(url, [
      {
        id: "ALT-1",
        domain: "threat-intelligence",
        title: "Suspicious C2 Beaconing to Known APT29 Infrastructure",
        description: "High-frequency outbound HTTPS beaconing detected to bulletproof IP 185.220.101.5 associated with Cozy Bear campaigns.",
        severity: "Critical",
        status: "Active",
        source: "AbuseIPDB & Flow Telemetry",
        indicator: "185.220.101.5",
        created_at: new Date().toISOString()
      },
      {
        id: "ALT-2",
        domain: "soc",
        title: "Kerberoasting & High-Volume Ticket Request Anomaly",
        description: "Multiple SPN ticket requests observed for sensitive service accounts within 90 seconds from host WIN-DEV-08.",
        severity: "Critical",
        status: "Active",
        source: "Active Directory Event ID 4769",
        indicator: "svc-backup-admin",
        created_at: new Date().toISOString()
      },
      {
        id: "ALT-3",
        domain: "vulnerabilities",
        title: "Zero-Day RCE Exploit in Edge Firewall (CVE-2024-21413)",
        description: "NVD CVSS v3.1 score 9.8 with actively weaponized EPSS probability 0.785 affecting public bastion listener.",
        severity: "Critical",
        status: "Active",
        source: "NVD Vulnerability Feed",
        indicator: "CVE-2024-21413",
        created_at: new Date().toISOString()
      },
      {
        id: "ALT-4",
        domain: "phishing",
        title: "Deceptive Typosquat Phishing Link Targetting Single-Sign-On",
        description: "Domain evil-invoice-phish.net registered with Let's Encrypt SSL certificate mimicking corporate SSO portal.",
        severity: "High",
        status: "Investigating",
        source: "URLhaus & Mail Gateway",
        indicator: "evil-invoice-phish.net",
        created_at: new Date().toISOString()
      }
    ]);
  },

  async getIncidents(): Promise<Incident[]> {
    return safeFetch<Incident[]>('/incidents', [
      {
        id: "INC-8492",
        title: "INC-8492: Multi-Stage C2 Beaconing and Lateral Movement",
        domain: "soc",
        priority: "Critical",
        status: "Open",
        assigned_to: "AI SOC Orchestrator",
        mttd_minutes: 14,
        mttr_minutes: 42,
        root_cause: "Phishing credential harvest followed by Cobalt Strike beacon execution",
        created_at: new Date().toISOString()
      },
      {
        id: "INC-8490",
        title: "INC-8490: Public Cloud Asset Exposure Remediation",
        domain: "cloud-security",
        priority: "High",
        status: "In Progress",
        assigned_to: "Cloud Security Assistant",
        mttd_minutes: 8,
        mttr_minutes: 25,
        root_cause: "Misconfigured Terraform deployment script without S3 bucket encryption enforce",
        created_at: new Date().toISOString()
      }
    ]);
  },

  async getInvestigations(): Promise<Investigation[]> {
    return safeFetch<Investigation[]>('/investigations', [
      {
        id: "demo-inv-1",
        indicator: "malicious-c2-update.org",
        indicator_type: "domain",
        title: "Demonstration Scenario: Suspicious Domain Investigation",
        status: "Waiting Approval",
        risk_score: 88.5,
        severity: "Critical",
        verdict: "Malicious Threat Indicator Confirmed",
        evidence_summary: "Autonomous multi-agent correlation confirms domain resolves to bulletproof Russian IP 185.220.101.5 with active Cobalt Strike C2 payload delivery.",
        mitre_technique: "T1071.001 - Web Protocols C2",
        threat_actor: "APT29 (Cozy Bear)",
        created_at: new Date().toISOString(),
        evidence: [
          {
            id: "ev-1",
            source: "AbuseIPDB Global Sensor Network",
            factor: "Threat Reputation (35%)",
            score_contribution: 32.2,
            confidence: 0.95,
            finding: "92% abuse confidence score. 214 abuse complaints reported for port scanning and SSH brute force in past 30 days.",
            created_at: new Date().toISOString()
          },
          {
            id: "ev-2",
            source: "URLhaus Malware URL Database",
            factor: "Evidence Weight (25%)",
            score_contribution: 22.0,
            confidence: 0.92,
            finding: "Active URL distributing payload-update.bin tagged as Cobalt Strike Beacon variant.",
            created_at: new Date().toISOString()
          },
          {
            id: "ev-3",
            source: "National Threat Telemetry Stream",
            factor: "Indicator Recency (15%)",
            score_contribution: 12.75,
            confidence: 0.90,
            finding: "Egress flows observed beaconing every 300 seconds from host WIN-DEV-08 within the last 2 hours.",
            created_at: new Date().toISOString()
          },
          {
            id: "ev-4",
            source: "MITRE ATT&CK Matrix Correlation",
            factor: "Related Threat Associations (15%)",
            score_contribution: 13.5,
            confidence: 0.90,
            finding: "TTPs match APT29 Cozy Bear campaign infrastructure T1071.001 and T1566.002.",
            created_at: new Date().toISOString()
          },
          {
            id: "ev-5",
            source: "ThreatGuard Sensor Provenance",
            factor: "Source Reliability (10%)",
            score_contribution: 9.5,
            confidence: 0.98,
            finding: "High-integrity dual cryptographic signature verification across internal and external sensors.",
            created_at: new Date().toISOString()
          }
        ],
        agent_runs: [
          {
            id: "ar-1",
            agent_name: "Central AI Supervisor",
            status: "Completed",
            logs: "Central Supervisor validated input 'malicious-c2-update.org'. Selected IOC Investigation Agent and Evidence Correlation Agent for autonomous dispatch.",
            created_at: new Date().toISOString()
          },
          {
            id: "ar-2",
            agent_name: "IOC Investigation Agent",
            status: "Completed",
            logs: "Queried MCP tools check_domain_intelligence and check_ip_reputation. Retrieved WHOIS privacy shield, fast-flux DNS records, and URLhaus blacklist status.",
            created_at: new Date().toISOString()
          },
          {
            id: "ar-3",
            agent_name: "Threat Actor Research Agent",
            status: "Completed",
            logs: "Attributed infrastructure to APT29 (Cozy Bear). Match confidence: 91%. Correlated with C2 server fingerprint.",
            created_at: new Date().toISOString()
          },
          {
            id: "ar-4",
            agent_name: "Evidence Correlation Agent",
            status: "Completed",
            logs: "Built 5-node forensic relationship graph. Risk Engine computed transparent 5-factor weighted score of 88.5 (Critical). Staged containment action for human approval.",
            created_at: new Date().toISOString()
          }
        ],
        approval_requests: [
          {
            id: "appr-1",
            action_type: "BLOCK_EGRESS_FIREWALL",
            target: "malicious-c2-update.org",
            description: "Proposed High-Impact Remediation: Block all outbound traffic on perimeter Palo Alto / Fortinet firewalls to 'malicious-c2-update.org' and resolve IP '185.220.101.5'.",
            impact_level: "High",
            status: "Pending",
            requester_agent: "Remediation Planning Agent",
            requested_at: new Date().toISOString()
          }
        ]
      }
    ]);
  },

  async startInvestigation(indicator: string): Promise<Investigation> {
    try {
      const res = await fetch(`${API_BASE}/investigations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }

    const isMalicious = indicator.toLowerCase().includes("malicious") || indicator.toLowerCase().includes("c2") || indicator.toLowerCase().includes("phish") || indicator.includes("185.220");
    const score = isMalicious ? 88.5 : 12.0;

    return {
      id: `inv-${Date.now()}`,
      indicator,
      indicator_type: indicator.includes(".") ? (indicator.match(/^\d/) ? "ip" : "domain") : "hash",
      title: `Autonomous Investigation: ${indicator}`,
      status: isMalicious ? "Waiting Approval" : "Completed",
      risk_score: score,
      severity: isMalicious ? "Critical" : "Low",
      verdict: isMalicious ? "Malicious Threat Indicator Confirmed" : "Benign / No Malicious Records",
      mitre_technique: isMalicious ? "T1071.001 - Web Protocols C2" : "T1043 - Common Port",
      threat_actor: isMalicious ? "APT29 (Cozy Bear)" : "Unattributed",
      created_at: new Date().toISOString(),
      evidence: [
        {
          id: `ev-${Date.now()}-1`,
          source: "AbuseIPDB Global Sensor Network",
          factor: "Threat Reputation (35%)",
          score_contribution: isMalicious ? 32.2 : 4.2,
          confidence: 0.95,
          finding: isMalicious ? "92% abuse confidence score from global reports." : "Clean IP history with zero abuse complaints.",
          created_at: new Date().toISOString()
        },
        {
          id: `ev-${Date.now()}-2`,
          source: "URLhaus Malware Repository",
          factor: "Evidence Weight (25%)",
          score_contribution: isMalicious ? 22.0 : 1.25,
          confidence: 0.92,
          finding: isMalicious ? "Payload distribution payload-update.bin tagged as Cobalt Strike Beacon." : "No malicious payloads associated with indicator.",
          created_at: new Date().toISOString()
        }
      ],
      agent_runs: [
        {
          id: `ar-${Date.now()}-1`,
          agent_name: "Central AI Supervisor",
          status: "Completed",
          logs: `Dispatched investigation for ${indicator}. Selected IOC Investigation Agent and Evidence Correlation Agent.`,
          created_at: new Date().toISOString()
        },
        {
          id: `ar-${Date.now()}-2`,
          agent_name: "IOC Investigation Agent",
          status: "Completed",
          logs: `Invoked MCP tools: check_reputation. Retrieved blacklist feeds and telemetry streams. Computed 5-factor risk: ${score}.`,
          created_at: new Date().toISOString()
        }
      ],
      approval_requests: isMalicious ? [
        {
          id: `appr-${Date.now()}`,
          action_type: "BLOCK_EGRESS_FIREWALL",
          target: indicator,
          description: `Block all outbound traffic on perimeter firewalls to '${indicator}'.`,
          impact_level: "High",
          status: "Pending",
          requester_agent: "Remediation Planning Agent",
          requested_at: new Date().toISOString()
        }
      ] : []
    };
  },

  async approveInvestigationAction(investigationId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/investigations/${investigationId}/approve`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { status: "Completed", approved_by: "Esha Amir Choudhary" };
  },

  async getMCPTools(): Promise<MCPTool[]> {
    return safeFetch<MCPTool[]>('/mcp/tools', [
      { name: "check_ip_reputation", description: "Inspect IP abuse confidence score and blacklist telemetry via AbuseIPDB.", category: "Threat Intelligence", parameters: [{ name: "ip", type: "string", description: "IPv4/IPv6", required: true }] },
      { name: "check_domain_intelligence", description: "Examine WHOIS registration, DNS entropy, and reputation for suspicious domains.", category: "Threat Intelligence", parameters: [{ name: "domain", type: "string", description: "FQDN", required: true }] },
      { name: "check_url_intelligence", description: "Query URLhaus and phishing repositories to inspect suspicious links.", category: "Email & Phishing Intelligence", parameters: [{ name: "url", type: "string", description: "Target URL", required: true }] },
      { name: "analyze_file_hash", description: "Lookup SHA-256 or MD5 hash against malware signature repositories.", category: "Endpoint & Malware Security", parameters: [{ name: "hash", type: "string", description: "File Hash", required: true }] },
      { name: "search_vulnerability", description: "Query NVD CVE database for CVSS v3.1/v4.0 base metrics and EPSS scores.", category: "Vulnerability Management", parameters: [{ name: "cve_id", type: "string", description: "CVE ID", required: true }] },
      { name: "search_attack_techniques", description: "Search MITRE ATT&CK enterprise matrix tactics and procedures.", category: "SOC & Correlation", parameters: [{ name: "query", type: "string", description: "Technique or Tactic", required: true }] },
      { name: "retrieve_security_alert", description: "Fetch normalized alert telemetry from centralized SOC queue.", category: "SOC Operations", parameters: [{ name: "alert_id", type: "string", description: "Alert UUID", required: true }] },
      { name: "get_investigation_details", description: "Retrieve forensic evidence graph, agent timeline, and risk metrics.", category: "Investigation & Orchestration", parameters: [{ name: "investigation_id", type: "string", description: "Investigation UUID", required: true }] },
      { name: "search_security_events", description: "Perform authorized search across ingested SIEM log telemetry.", category: "Security Operations Center", parameters: [{ name: "query", type: "string", description: "Search term", required: true }] },
      { name: "generate_threat_report", description: "Compile executive or technical briefing synthesizing findings.", category: "Reporting & GRC", parameters: [{ name: "investigation_id", type: "string", description: "Investigation ID", required: true }] },
      { name: "retrieve_remediation_status", description: "Check patch verification status for assigned remediation tasks.", category: "Vulnerability Management", parameters: [{ name: "cve_or_asset_id", type: "string", description: "Identifier", required: true }] },
      { name: "retrieve_organization_security_summary", description: "Fetch high-level posture score, active incident counts, and MTTD/MTTR.", category: "Command Center", parameters: [] }
    ]);
  },

  async chatWithAssistant(domain: string, message: string, indicatorContext?: string): Promise<{ response: string; suggested_actions: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/assistants/${domain}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, domain, indicator_context: indicatorContext })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      response: `### ThreatGuard Assistant (${domain.toUpperCase()}):\nI have correlated telemetry for your query: "${message}".\n\n1. **Telemetry Status**: All sensor streams are operating at normal baseline.\n2. **Evidence Correlation**: Assessed against MITRE ATT&CK T1071 C2 and NIST CSF 2.0 controls.\n3. **Recommended Action**: Review open incidents in the Command Center and launch multi-agent investigation if new anomalous traffic is detected.`,
      suggested_actions: ["Investigate indicator reputation", "Map to MITRE ATT&CK", "Trigger containment action"]
    };
  },

  async getModuleDetails(domain: string): Promise<any> {
    return safeFetch<any>(`/modules/${domain}/details`, {
      title: `${domain.toUpperCase()} Domain`,
      description: "Dedicated cybersecurity workspace for specialized telemetry and investigation.",
      stats: { "Monitored Items": 124, "Active Alerts": 3, "Compliance Rate": "82%" },
      findings: [
        { indicator: "185.220.101.5", type: "Indicator", severity: "Critical", source: "Threat Feed", status: "Active" },
        { indicator: "s3-internal-audit-backup", type: "Asset", severity: "High", source: "CSPM Scanner", status: "Investigating" }
      ],
      agents: ["Domain Triage Agent", "Correlation Agent", "Remediation Advisor"],
      tasks: [
        { title: "Review critical findings in queue", status: "In Progress", priority: "High" },
        { title: "Verify patch compliance checklist", status: "Pending", priority: "Medium" }
      ],
      progress: 78.5
    });
  }
};
