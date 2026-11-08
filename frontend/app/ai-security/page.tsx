'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Workflow,
  Cpu,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function AISecurityPage() {
  return (
    <div className="space-y-16 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan">
          <span>Multi-Agent System & Governance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-cyber-white tracking-tight">
          Autonomous Agent Orchestration & MCP Standard
        </h1>
        <p className="text-sm text-cyber-muted font-mono leading-relaxed">
          Discover how ThreatGuard AI coordinates multiple specialized agents using LangGraph patterns, interacts with tools via Model Context Protocol (MCP), and enforces strict Human-in-the-Loop guardrails.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-3">
          <Workflow className="w-8 h-8 text-cyber-cyan" />
          <h3 className="text-base font-bold text-cyber-white">Central Supervisor Agent</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            Routes incoming telemetry and queries to domain-specific agents, preserving execution state and memory across the entire investigation lifecycle.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-3">
          <Terminal className="w-8 h-8 text-cyber-turquoise" />
          <h3 className="text-base font-bold text-cyber-white">Model Context Protocol (MCP)</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            12 standardized tools expose safe querying of AbuseIPDB, URLhaus, NVD, and internal SOC alerts with strict schema validation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-3">
          <Lock className="w-8 h-8 text-cyber-gold" />
          <h3 className="text-base font-bold text-cyber-white">Human Approval Gate</h3>
          <p className="text-xs text-cyber-muted leading-relaxed">
            High-impact defensive remediations (firewall drop, credential revocation, endpoint isolation) are permanently staged until explicitly signed off by a human analyst.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-cyber-navy/50 border border-cyber-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-cyber-white">See the Multi-Agent Activity Center</h3>
          <p className="text-xs text-cyber-muted font-mono mt-1">Inspect live tool calls, agent execution logs, and pending approvals.</p>
        </div>
        <Link
          href="/agents"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyber-cyan text-cyber-deep font-bold font-mono text-xs shadow-cyber-cyan hover:bg-cyber-cyan/90 transition-colors"
        >
          <span>Open Agent Activity Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
