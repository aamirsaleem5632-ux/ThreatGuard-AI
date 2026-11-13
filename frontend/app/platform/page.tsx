'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shield,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Network
} from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="space-y-16 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0A10] border border-purple-500/25 text-xs font-mono text-purple-300">
          <span>Enterprise Platform Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          A Unified Cybersecurity Intelligence Ecosystem
        </h1>
        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
          ThreatGuard AI bridges fragmented SOC telemetry across 12 distinct cybersecurity domains into a cohesive, explainable, and autonomous operations center.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#07110A] border border-purple-500/15 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#030705] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(104,166,109,0.25)]">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Central Security Command Center</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Consolidated organizational risk posture, MTTD/MTTR analytics, MITRE ATT&CK coverage heatmap, and active incident correlation queues.
          </p>
          <ul className="text-xs font-mono text-zinc-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-time Posture Scoring</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Cross-Domain Correlation</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(201,168,68,0.25)]">
            <Workflow className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Multi-Agent LangGraph Engine</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Autonomous multi-agent orchestration managed by a Central Supervisor agent with specialized domain agents and shared forensic state.
          </p>
          <ul className="text-xs font-mono text-zinc-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Model Context Protocol (MCP)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Deterministic Heuristic Fallbacks</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(201,168,68,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent 5-Factor Risk Engine</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Evidence-based calculation replacing black-box hallucinations with explainable mathematics and full forensic provenance.
          </p>
          <ul className="text-xs font-mono text-zinc-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Mathematical Weighted Formula</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Human-in-the-Loop Approval Gate</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Cross-Module Intelligence Flow */}
      <div className="p-8 rounded-3xl bg-[#08130B]/60 border border-purple-500/15 space-y-6">
        <h2 className="text-2xl font-bold text-white">The Shared Cyber Intelligence Graph</h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-3xl leading-relaxed">
          When an anomaly is flagged in Email & Phishing (e.g. deceptive link), the intelligence graph propagates the IOC to Network NDR sensors, queries AbuseIPDB and URLhaus, verifies CVE exposure in Vulnerability Management, and informs SOC incident queues automatically.
        </p>

        <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
          <Link
            href="/graph"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(104,166,109,0.2)]"
          >
            <Network className="w-4 h-4 text-purple-300" />
            <span>Explore Cyber Intelligence Graph</span>
          </Link>
          <Link
            href="/command-center"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0A10] hover:bg-[#0F0E18] text-white border border-purple-500/15"
          >
            <span>Open Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
