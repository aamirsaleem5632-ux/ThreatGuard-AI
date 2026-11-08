from typing import Dict, Any, List

class RiskEngine:
    """
    Transparent 5-Factor Risk Assessment Engine conforming to ThreatGuard AI Spec Section 21:
    - Threat reputation: 35%
    - Evidence from intelligence sources: 25%
    - Indicator activity and recency: 15%
    - Related threat associations: 15%
    - Source reliability: 10%
    """
    
    WEIGHTS = {
        "reputation": 0.35,
        "evidence": 0.25,
        "recency": 0.15,
        "associations": 0.15,
        "reliability": 0.10
    }

    @classmethod
    def calculate_risk(
        cls,
        reputation_score: float,     # 0 to 100
        evidence_score: float,       # 0 to 100
        recency_score: float,        # 0 to 100
        associations_score: float,   # 0 to 100
        reliability_score: float     # 0 to 100
    ) -> Dict[str, Any]:
        """Calculates transparent weighted risk score and severity."""
        
        weighted_score = (
            (reputation_score * cls.WEIGHTS["reputation"]) +
            (evidence_score * cls.WEIGHTS["evidence"]) +
            (recency_score * cls.WEIGHTS["recency"]) +
            (associations_score * cls.WEIGHTS["associations"]) +
            (reliability_score * cls.WEIGHTS["reliability"])
        )
        
        # Round to 1 decimal place
        final_score = round(min(max(weighted_score, 0.0), 100.0), 1)
        
        # Determine Severity Band
        if final_score >= 75.0:
            severity = "Critical"
        elif final_score >= 50.0:
            severity = "High"
        elif final_score >= 25.0:
            severity = "Medium"
        else:
            severity = "Low"

        # Determine Verdict
        if final_score >= 75.0:
            verdict = "Malicious Threat Indicator Confirmed"
        elif final_score >= 50.0:
            verdict = "Suspicious Indicator - High Risk of Compromise"
        elif final_score >= 25.0:
            verdict = "Low-Confidence Anomaly Detected"
        else:
            verdict = "Benign / No Known Malicious Activity"

        factors_breakdown = {
            "reputation": {
                "raw_score": reputation_score,
                "weight": cls.WEIGHTS["reputation"],
                "contribution": round(reputation_score * cls.WEIGHTS["reputation"], 2),
                "description": "Historical abuse complaints and blacklist entries"
            },
            "evidence": {
                "raw_score": evidence_score,
                "weight": cls.WEIGHTS["evidence"],
                "contribution": round(evidence_score * cls.WEIGHTS["evidence"], 2),
                "description": "Verified malware signatures and sandbox analysis findings"
            },
            "recency": {
                "raw_score": recency_score,
                "weight": cls.WEIGHTS["recency"],
                "contribution": round(recency_score * cls.WEIGHTS["recency"], 2),
                "description": "Frequency and proximity of observed egress telemetry"
            },
            "associations": {
                "raw_score": associations_score,
                "weight": cls.WEIGHTS["associations"],
                "contribution": round(associations_score * cls.WEIGHTS["associations"], 2),
                "description": "Correlated threat actor infrastructure and known campaigns"
            },
            "reliability": {
                "raw_score": reliability_score,
                "weight": cls.WEIGHTS["reliability"],
                "contribution": round(reliability_score * cls.WEIGHTS["reliability"], 2),
                "description": "Confidence rating of reporting intelligence feeds"
            }
        }

        return {
            "score": final_score,
            "severity": severity,
            "verdict": verdict,
            "factors": factors_breakdown
        }
