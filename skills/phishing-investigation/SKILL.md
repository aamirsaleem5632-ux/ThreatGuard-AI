---
name: phishing-investigation
title: "Email, Phishing & Fraud Analysis"
version: 1.0.0
category: Cybersecurity
---

# Email, Phishing & Fraud Analysis

## 1. Purpose
Analyze email headers, deceptive domains, phishing kits, and impersonation attempts.

## 2. Scope
This skill operates strictly within the context of the ThreatGuard AI multi-agent platform for authorized organizational assets and security operations.

## 3. Activation Conditions
- Activated when the Central Supervisor or domain agent identifies tasks requiring email, phishing & fraud analysis.
- Invoked automatically during multi-agent investigation workflows or directly by SOC analysts.

## 4. Required Inputs
- Target artifact, indicator, telemetry identifier, or alert payload.
- Organization workspace context and user permission credentials.
- Investigation Session ID.

## 5. Expected Outputs
- Structured JSON assessment containing confidence score, severity band, evidence records, and actionable mitigations.
- Formatted markdown summary for presentation in the domain AI Assistant and Command Center.

## 6. Step-by-Step Instructions
1. Validate format and sanitize input parameters to prevent injection or malformed queries.
2. Verify organizational authorization for the target asset or indicator.
3. Query authorized MCP tools and connected intelligence databases (AbuseIPDB, URLhaus, NVD, MITRE ATT&CK).
4. Extract, normalize, and score telemetry signals according to verified provenance.
5. Compute transparent risk factors: Threat Reputation (35%), Evidence Weight (25%), Recency (15%), Associations (15%), Source Reliability (10%).
6. Generate defensive recommendations, tagging consequential remediation actions for human approval.
7. Record all audit trails and commit findings to the Shared Cyber Intelligence Graph.

## 7. Available Tools
- `check_ip_reputation`
- `check_domain_intelligence`
- `check_url_intelligence`
- `analyze_file_hash`
- `search_vulnerability`
- `search_attack_techniques`
- `retrieve_security_alert`
- `get_investigation_details`

## 8. Validation Requirements
- All external indicators must adhere to strict regex definitions (IPv4/IPv6, RFC compliant domain, SHA-256/MD5).
- Confidence scores must be bounded between 0.0 and 1.0.

## 9. Security & Governance Restrictions
- Read-only queries by default. No disruptive network actions without explicit Human-in-the-Loop approval.
- Context isolation: strictly prevent cross-tenant data leakage.

## 10. Error Handling Instructions
- Fallback gracefully to cached or simulated intelligence if third-party APIs fail or rate limits are reached.
- Explicitly label incomplete or inconclusive data; never hallucinate safety in the absence of telemetry.

## 11. Evidence Requirements
- Retain exact timestamp, raw payload hash, source provider citation, and confidence rating for every finding.
