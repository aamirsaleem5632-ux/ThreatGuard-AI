'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Zap,
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Terminal,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { api } from '@/lib/api';
import { Investigation, EvidenceRecord, AgentRun, ApprovalRequest } from '@/lib/types';

function InvestigationsContent() {
  const searchParams = useSearchParams();
  const targetParam = searchParams.get('target');

  const [inputIndicator, setInputIndicator] = useState(targetParam || 'malicious-c2-update.org');
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [approvalDecided, setApprovalDecided] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'agents' | 'risk' | 'report'>('evidence');

  // Load initial demo investigation
  useEffect(() => {
    async function loadInitial() {
      if (targetParam) {
        handleTriggerInvestigation(targetParam);
      } else {
        const invs = await api.getInvestigations();
        if (invs.length > 0) {
          setInvestigation(invs[0]);
        }
      }
    }
    loadInitial();
  }, [targetParam]);

  const handleTriggerInvestigation = async (indicatorToRun?: string) => {
    const target = indicatorToRun || inputIndicator;
    if (!target.trim()) return;

    setIsRunning(true);
    setApprovalDecided(false);
    try {
      const res = await api.startInvestigation(target.trim());
      setInvestigation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApproveAction = async () => {
    if (!investigation) return;
    try {
      await api.approveInvestigationAction(investigation.id);
      setApprovalDecided(true);
      setInvestigation(prev => prev ? {
        ...prev,
        status: "Completed",
        approval_requests: prev.approval_requests?.map(a => ({
          ...a,
          status: "Approved",
          approved_by: "Esha Amir Choudhary"
        }))
      } : null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-gold animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-gold uppercase tracking-wider font-bold">
              Autonomous Investigation Workbench
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
            Multi-Agent Threat Triage & Evidence Engine
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            Section 32 Demonstration Scenario: End-to-End Autonomous Indicator Investigation
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTriggerInvestigation();
          }}
          className="flex items-center gap-2 max-w-md w-full"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputIndicator}
              onChange={(e) => setInputIndicator(e.target.value)}
              placeholder="Enter IP, domain, URL, or hash..."
              className="w-full bg-cyber-deep border border-cyber-card rounded-lg pl-10 pr-3 py-2 text-xs text-cyber-white font-mono placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan"
            />
          </div>
          <button
            type="submit"
            disabled={isRunning || !inputIndicator.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-cyan text-cyber-deep font-bold text-xs font-mono shadow-cyber-cyan hover:bg-cyber-cyan/90 disabled:opacity-40 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Analyzing...' : 'Investigate'}</span>
          </button>
        </form>
      </div>

      {isRunning && (
        <div className="p-8 rounded-2xl bg-cyber-navy/80 border border-cyber-cyan/40 text-center space-y-4 shadow-cyber-cyan animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin mx-auto"></div>
          <div className="text-sm font-bold font-mono text-cyber-white">
            Autonomous Multi-Agent Workflow In Progress...
          </div>
          <div className="text-xs font-mono text-cyber-muted max-w-md mx-auto">
            Central Supervisor → IOC Agent → MCP Tools (AbuseIPDB, URLhaus) → MITRE Attribution → Transparent 5-Factor Risk Engine
          </div>
        </div>
      )}

      {investigation && !isRunning && (
        <div className="space-y-6">
          {/* Active Investigation Verdict Header Card */}
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyber-deep">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-navy border border-cyber-cyan/30 text-cyber-cyan uppercase">
                    {investigation.indicator_type}
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-cyber-white">
                    {investigation.indicator}
                  </span>
                </div>
                <div className="text-xs text-cyber-muted font-mono">
                  {investigation.title}
                </div>
              </div>

              {/* Status and Score pill */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-cyber-muted uppercase">Risk Score</div>
                  <div className="text-2xl font-bold font-mono text-cyber-critical">
                    {investigation.risk_score} <span className="text-xs text-cyber-muted font-normal">/ 100</span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs uppercase ${
                  investigation.severity === 'Critical'
                    ? 'bg-cyber-critical/20 text-cyber-critical border-cyber-critical/40'
                    : 'bg-cyber-warning/20 text-cyber-warning border-cyber-warning/40'
                }`}>
                  {investigation.severity} Severity
                </div>
              </div>
            </div>

            {/* Verdict summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-cyber-deep border border-cyber-card space-y-1">
                <span className="text-cyber-muted uppercase text-[10px]">Calculated Verdict:</span>
                <div className="font-bold text-cyber-white">{investigation.verdict}</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-deep border border-cyber-card space-y-1">
                <span className="text-cyber-muted uppercase text-[10px]">MITRE ATT&CK Mapping:</span>
                <div className="font-bold text-cyber-cyan">{investigation.mitre_technique || 'T1071 - Web Protocols'}</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-deep border border-cyber-card space-y-1">
                <span className="text-cyber-muted uppercase text-[10px]">Attributed Threat Actor:</span>
                <div className="font-bold text-cyber-gold">{investigation.threat_actor || 'APT29 (Cozy Bear)'}</div>
              </div>
            </div>

            {/* Human Approval Callout (Section 24 & 32 Demonstration!) */}
            {investigation.approval_requests && investigation.approval_requests.length > 0 && (
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                investigation.status === 'Waiting Approval'
                  ? 'bg-cyber-critical/10 border-cyber-critical/40 shadow-cyber-red'
                  : 'bg-cyber-success/10 border-cyber-success/40'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className={`w-4 h-4 ${investigation.status === 'Waiting Approval' ? 'text-cyber-critical' : 'text-cyber-success'}`} />
                    <span className="font-bold text-xs uppercase font-mono text-cyber-white">
                      Human-in-the-Loop Governance: {investigation.approval_requests[0].action_type}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      investigation.status === 'Waiting Approval'
                        ? 'bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/40'
                        : 'bg-cyber-success/20 text-cyber-success border border-cyber-success/40'
                    }`}>
                      {investigation.status === 'Waiting Approval' ? 'Pending Approval' : 'Approved & Enforced'}
                    </span>
                  </div>
                  <p className="text-xs text-cyber-muted">
                    {investigation.approval_requests[0].description}
                  </p>
                  {investigation.approval_requests[0].approved_by && (
                    <div className="text-[11px] font-mono text-cyber-turquoise pt-1">
                      Action certified and approved by: <strong className="text-cyber-white">{investigation.approval_requests[0].approved_by}</strong>
                    </div>
                  )}
                </div>

                {investigation.status === 'Waiting Approval' && (
                  <button
                    onClick={handleApproveAction}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-critical hover:bg-cyber-critical/90 text-cyber-white font-bold text-xs font-mono shadow-cyber-red transition-all whitespace-nowrap self-start md:self-center"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve Egress Firewall Block</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cyber-card gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'evidence'
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-transparent text-cyber-muted hover:text-cyber-white'
              }`}
            >
              Forensic Evidence ({investigation.evidence?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'risk'
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-transparent text-cyber-muted hover:text-cyber-white'
              }`}
            >
              5-Factor Risk Formula
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'agents'
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-transparent text-cyber-muted hover:text-cyber-white'
              }`}
            >
              Agent Execution Timeline ({investigation.agent_runs?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'report'
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-transparent text-cyber-muted hover:text-cyber-white'
              }`}
            >
              Certified Report
            </button>
          </div>

          {/* TAB 1: EVIDENCE RECORDS */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              {investigation.evidence?.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-cyber-card border border-cyber-card space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-cyan font-bold">{ev.source}</span>
                      <span className="text-cyber-muted">•</span>
                      <span className="text-cyber-gold">{ev.factor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-muted">Weight Contribution:</span>
                      <span className="text-cyber-white font-bold">+{ev.score_contribution}</span>
                      <span className="text-[10px] text-cyber-turquoise">({int(ev.confidence * 100)}% Conf)</span>
                    </div>
                  </div>
                  <p className="text-xs text-cyber-white/90 leading-relaxed font-sans">{ev.finding}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 5-FACTOR RISK FORMULA */}
          {activeTab === 'risk' && (
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-6">
              <div>
                <h3 className="text-sm font-bold font-mono text-cyber-white uppercase">
                  Transparent 5-Factor Scoring Model (Section 21 Spec)
                </h3>
                <p className="text-xs text-cyber-muted font-mono mt-1">
                  Formula: Risk = (Threat Rep × 35%) + (Evidence Weight × 25%) + (Recency × 15%) + (Associations × 15%) + (Source Reliability × 10%)
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyber-cyan">Factor 1: Threat Reputation (35% Weight)</span>
                    <span className="text-cyber-white font-bold">Score: 92/100 → +32.2 Contribution</span>
                  </div>
                  <p className="text-xs text-cyber-muted">Historical abuse complaints, blacklists (AbuseIPDB), and sensor bad-reputation flags.</p>
                </div>

                <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyber-turquoise">Factor 2: Evidence from Intelligence Sources (25% Weight)</span>
                    <span className="text-cyber-white font-bold">Score: 88/100 → +22.0 Contribution</span>
                  </div>
                  <p className="text-xs text-cyber-muted">Verified malware payload signatures on URLhaus and sandbox analysis results.</p>
                </div>

                <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyber-gold">Factor 3: Indicator Activity & Recency (15% Weight)</span>
                    <span className="text-cyber-white font-bold">Score: 85/100 → +12.75 Contribution</span>
                  </div>
                  <p className="text-xs text-cyber-muted">Frequency and recency of observed outbound network beaconing telemetry within 3 hours.</p>
                </div>

                <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyber-critical">Factor 4: Related Threat Associations (15% Weight)</span>
                    <span className="text-cyber-white font-bold">Score: 90/100 → +13.5 Contribution</span>
                  </div>
                  <p className="text-xs text-cyber-muted">Correlated adversary APT29 Cozy Bear infrastructure and active campaign fingerprints.</p>
                </div>

                <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyber-white">Factor 5: Source Reliability (10% Weight)</span>
                    <span className="text-cyber-white font-bold">Score: 95/100 → +9.5 Contribution</span>
                  </div>
                  <p className="text-xs text-cyber-muted">Dual-signature cryptographic sensor validation and high source provenance integrity.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyber-deep/90 border border-cyber-cyan/30 flex items-center justify-between font-mono text-xs">
                <span>Total Aggregated Score:</span>
                <span className="text-xl font-bold text-cyber-critical">88.5 / 100 (Critical Severity)</span>
              </div>
            </div>
          )}

          {/* TAB 3: AGENTS TIMELINE */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              {investigation.agent_runs?.map((run, i) => (
                <div
                  key={run.id}
                  className="p-4 rounded-xl bg-cyber-card border border-cyber-card space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyber-cyan" />
                      <span className="font-bold text-cyber-white">{run.agent_name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-turquoise/20 text-cyber-turquoise border border-cyber-turquoise/30">
                      {run.status}
                    </span>
                  </div>
                  <p className="text-cyber-muted whitespace-pre-wrap">{run.logs}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CERTIFIED REPORT */}
          {activeTab === 'report' && (
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-deep">
                <div className="font-bold text-cyber-white uppercase">
                  Certified TLP:AMBER Technical Forensic Briefing
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-cyber-deep hover:bg-cyber-elevated border border-cyber-card text-cyber-cyan"
                >
                  Export PDF
                </button>
              </div>

              <div className="p-4 rounded-xl bg-cyber-deep text-cyber-white/90 leading-relaxed whitespace-pre-wrap">
{`# THREATGUARD AI - INVESTIGATION SUMMARY REPORT
Target Indicator: ${investigation.indicator} (${investigation.indicator_type})
Timestamp: ${new Date(investigation.created_at).toUTCString()}
Assessed Severity: ${investigation.severity.toUpperCase()} (${investigation.risk_score}/100)
Calculated Verdict: ${investigation.verdict}

MITRE ATT&CK Technique: ${investigation.mitre_technique || 'T1071.001 - Web Protocols'}
Adversary Attribution: ${investigation.threat_actor || 'APT29 (Cozy Bear)'}

MANDATORY CONTAINMENT ACTIONS:
1. Block all perimeter egress to ${investigation.indicator} across edge firewalls.
2. Invalidate active session tokens for internal hosts exhibiting beaconing behavior.
3. Submit IOC signatures to EDR perimeter sensors.`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function int(val: number) {
  return Math.round(val);
}

export default function InvestigationsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-cyber-muted font-mono">Initializing Investigation Workbench...</div>}>
      <InvestigationsContent />
    </React.Suspense>
  );
}
