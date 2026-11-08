'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('executive');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const content = `# THREATGUARD AI - SECURITY INTELLIGENCE REPORT
Date: ${new Date().toUTCString()}
Classification: TLP:AMBER | STRICTLY CONFIDENTIAL
Report Type: ${reportType.toUpperCase()} SUMMARY
Organization: Global Defense Financial Corporation

1. EXECUTIVE RISK POSTURE
Overall Enterprise Posture Score: 78.5 / 100 (Optimal).
Total Monitored Domains: 12. Active SOC Incidents: 2.
Mean Time to Detect (MTTD): 14 minutes. Mean Time to Respond (MTTR): 42 minutes.

2. CRITICAL INCIDENTS & ATTRIBUTION
- Ingestion of C2 beaconing alerts targeting 185.220.101.5.
- Multi-agent investigation completed with transparent 5-factor risk score 88.5 (Critical).
- Adversary attributed to APT29 (Cozy Bear) utilizing MITRE ATT&CK T1071.001.

3. GOVERNANCE & REMEDIATION WORKFLOW
- Human-in-the-Loop authorization granted for perimeter firewall drop.
- Endpoint telemetry verified with zero lateral movement detected.
- Compliance control PR.AC-1 certified compliant under NIST CSF 2.0 framework.

*Certified by ThreatGuard AI Autonomous Reporting Engine.*`;
      setGeneratedReport(content);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider font-bold">
              Enterprise Reporting Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
            Executive & Technical Briefing Generator
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            Automated synthesis of telemetry, investigations, and NIST compliance evidence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            disabled={!generatedReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-deep hover:bg-cyber-elevated border border-cyber-card text-xs font-mono text-cyber-white disabled:opacity-40 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyber-muted" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls (1 Col) */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="text-xs font-bold font-mono text-cyber-white uppercase pb-2 border-b border-cyber-deep">
            Report Parameters
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-cyber-muted mb-1 uppercase text-[10px]">Select Template:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg p-2 text-cyber-white focus:outline-none focus:border-cyber-cyan text-xs"
              >
                <option value="executive">Executive Board Briefing</option>
                <option value="technical">Technical Forensic Brief (TLP:AMBER)</option>
                <option value="incident">Incident Response Audit Trail</option>
                <option value="compliance">NIST CSF 2.0 Compliance Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-cyber-muted mb-1 uppercase text-[10px]">Scope:</label>
              <div className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-card text-cyber-white">
                All 12 Monitored Domains
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan/30 to-cyber-turquoise/30 hover:from-cyber-cyan/40 hover:to-cyber-turquoise/40 text-cyber-cyan border border-cyber-cyan/50 font-bold text-xs shadow-cyber-cyan disabled:opacity-40 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Compiling Evidence...' : 'Generate Certified Brief'}</span>
            </button>
          </div>
        </div>

        {/* Report Preview (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-deep">
            <span className="font-bold text-cyber-white uppercase">Live Document Preview</span>
            <span className="text-[10px] text-cyber-turquoise px-2 py-0.5 rounded bg-cyber-turquoise/10 border border-cyber-turquoise/30">
              Verified Provenance
            </span>
          </div>

          {generatedReport ? (
            <div className="p-6 rounded-xl bg-cyber-deep text-cyber-white/90 leading-relaxed whitespace-pre-wrap border border-cyber-card">
              {generatedReport}
            </div>
          ) : (
            <div className="py-20 text-center text-cyber-muted space-y-2">
              <FileText className="w-8 h-8 mx-auto text-cyber-card" />
              <p>Select report parameters and click &ldquo;Generate Certified Brief&rdquo;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
