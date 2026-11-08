'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shield,
  Layers,
  Cpu,
  Workflow,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  GitBranch,
  Network
} from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="space-y-16 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan">
          <span>Enterprise Platform Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-cyber-white tracking-tight">
          A Unified Cybersecurity Intelligence Ecosystem
        </h1>
        <p className="text-sm text-cyber-muted font-mono leading-relaxed">
          ThreatGuard AI bridges fragmented SOC telemetry across 12 distinct cybersecurity domains into a cohesive, explainable, and autonomous operations center.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-deep border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-cyber-cyan">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cyber-white">Central Security Command Center</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Consolidated organizational risk posture, MTTD/MTTR analytics, MITRE ATT&CK coverage heatmap, and active incident correlation queues.
          </p>
          <ul className="text-xs font-mono text-cyber-muted space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Real-time Posture Scoring</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Cross-Domain Correlation</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-deep border border-cyber-turquoise/40 flex items-center justify-center text-cyber-turquoise shadow-cyber-cyan">
            <Workflow className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cyber-white">Multi-Agent LangGraph Engine</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Autonomous multi-agent orchestration managed by a Central Supervisor agent with specialized domain agents and shared forensic state.
          </p>
          <ul className="text-xs font-mono text-cyber-muted space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Model Context Protocol (MCP)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Deterministic Heuristic Fallbacks</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-deep border border-cyber-gold/40 flex items-center justify-center text-cyber-gold shadow-cyber-gold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cyber-white">Transparent 5-Factor Risk Engine</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Evidence-based calculation replacing black-box hallucinations with explainable mathematics and full forensic provenance.
          </p>
          <ul className="text-xs font-mono text-cyber-muted space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Mathematical Weighted Formula</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-turquoise" />
              <span>Human-in-the-Loop Approval Gate</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Cross-Module Intelligence Flow */}
      <div className="p-8 rounded-3xl bg-cyber-navy/40 border border-cyber-card space-y-6">
        <h2 className="text-2xl font-bold text-cyber-white">The Shared Cyber Intelligence Graph</h2>
        <p className="text-xs sm:text-sm text-cyber-muted font-mono max-w-3xl leading-relaxed">
          When an anomaly is flagged in Email & Phishing (e.g. deceptive link), the intelligence graph propagates the IOC to Network NDR sensors, queries AbuseIPDB and URLhaus, verifies CVE exposure in Vulnerability Management, and informs SOC incident queues automatically.
        </p>

        <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
          <Link
            href="/graph"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/40"
          >
            <Network className="w-4 h-4" />
            <span>Explore Cyber Intelligence Graph</span>
          </Link>
          <Link
            href="/command-center"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-card hover:bg-cyber-elevated text-cyber-white border border-cyber-card"
          >
            <span>Open Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
