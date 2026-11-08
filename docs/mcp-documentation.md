# Model Context Protocol (MCP) Server Specifications

## 1. MCP Standard Compliance
ThreatGuard AI exposes an internal MCP Server implementation adhering to the Model Context Protocol specification, enabling standard AI agents to discover, validate, and execute cybersecurity tools safely.

## 2. Registered MCP Tools
1. `check_ip_reputation(ip: str)`: Inspect IP abuse confidence score and blacklist history.
2. `check_domain_intelligence(domain: str)`: Verify domain registrar, DNS records, and WHOIS.
3. `check_url_intelligence(url: str)`: Check URLhaus and malicious URL blacklists.
4. `analyze_file_hash(hash: str)`: Inspect SHA256/MD5 hash reputation and malware associations.
5. `search_vulnerability(cve_id: str)`: Query NVD for CVSS v3.1 base score, attack vector, and patches.
6. `search_attack_techniques(query: str)`: Map behavior to MITRE ATT&CK techniques (T1059, T1190, etc.).
7. `retrieve_security_alert(alert_id: str)`: Fetch ingested SIEM alert telemetry.
8. `get_investigation_details(investigation_id: str)`: Retrieve full evidence graph and agent timeline.
9. `generate_threat_report(investigation_id: str)`: Synthesize executive summary and IOC defense playbook.
10. `retrieve_organization_security_summary()`: Return aggregate posture and vulnerability metrics.
