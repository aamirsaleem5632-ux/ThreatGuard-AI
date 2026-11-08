# Testing & Quality Assurance Plan

## 1. Test Levels
- **Unit Testing**: Pytest for backend schemas, risk calculation formulas, and MCP tool serialization.
- **Integration Testing**: End-to-end API testing of investigation lifecycle and indicator queries.
- **Frontend Testing**: Component rendering tests and accessibility audits.
- **AI Evaluation**: Ground-truth validation of threat classification against known malicious and benign IOC datasets.

## 2. Risk Engine Formula Verification
- Formula: `Risk = (Threat_Rep * 0.35) + (Evidence_Weight * 0.25) + (Recency * 0.15) + (Associations * 0.15) + (Source_Reliability * 0.10)`.
- Verified against critical, high, medium, and low test vectors.
