'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowRight,
  Zap,
  Bot,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Network,
  Cpu,
  Fingerprint,
  Radio,
  Bug,
  Code2,
  Cloud,
  FileCheck2,
  Sparkles
} from 'lucide-react';

const DOMAIN_CARDS = [
  { id: 'threat-intelligence', title: 'Threat Intelligence', icon: Radio, desc: 'IOC reputation, AbuseIPDB/URLhaus feeds, and adversary attribution.' },
  { id: 'soc', title: 'SOC Operations', icon: Activity, desc: 'Centralized alert monitoring, correlation, and sub-15-minute MTTD/MTTR.' },
  { id: 'vulnerabilities', title: 'Vulnerability Mgmt', icon: Bug, desc: 'CVE intelligence, CVSS v3.1/v4.0 scoring, and EPSS exploit prioritization.' },
  { id: 'application-security', title: 'App & API Security', icon: Code2, desc: 'OWASP Top 10 mitigation, token flaw auditing, and secure API telemetry.' },
  { id: 'cloud-security', title: 'Cloud Security (CSPM)', icon: Cloud, desc: 'Multi-cloud posture management, IAM over-privilege audits, and S3 leaks.' },
  { id: 'identity-security', title: 'Identity & Access (ITDR)', icon: Fingerprint, desc: 'Suspicious login analysis, UEBA impossible travel, and Kerberoasting triage.' },
  { id: 'phishing', title: 'Email & Phishing Intel', icon: ShieldAlert, desc: 'Domain impersonation, SPF/DKIM verification, and phishing kit forensics.' },
  { id: 'endpoint-security', title: 'Endpoint & EDR Security', icon: Cpu, desc: 'Behavioral ransomware prevention, suspicious process trees, and binary hashes.' },
  { id: 'network-security', title: 'Network Intelligence (NDR)', icon: Network, desc: 'Traffic flow anomalies, DNS tunneling detection, and egress C2 drop policies.' },
  { id: 'supply-chain', title: 'Supply Chain & SBOM', icon: Layers, desc: 'SBOM component auditing, OSS vulnerability detection, and vendor risk scores.' },
  { id: 'ai-security-module', title: 'AI & Agent Security', icon: Bot, desc: 'Prompt injection defenses, LLM tool boundaries, and agent governance.' },
  { id: 'governance', title: 'GRC & Incident Response', icon: FileCheck2, desc: 'NIST CSF 2.0 & ISO 27001 mapping, policy audits, and certified reporting.' }
];

export default function HomePage() {
  return (
    <div className="space-y-24 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-card border border-cyber-cyan/40 text-xs font-mono text-cyber-cyan shadow-cyber-cyan">
          <span className="w-2 h-2 rounded-full bg-cyber-turquoise animate-ping"></span>
          <span>Next-Generation Autonomous Security Operations (ASO)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-cyber-white max-w-4xl mx-auto leading-tight">
          One Platform. Twelve Domains. <br />
          <span className="bg-gradient-to-r from-cyber-cyan via-cyber-turquoise to-cyber-gold bg-clip-text text-transparent">
            Twelve Autonomous AI Copilots.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-cyber-muted max-w-2xl mx-auto font-mono leading-relaxed">
          Unify enterprise threat intelligence, multi-agent LangGraph orchestration, Model Context Protocol (MCP) tooling, and transparent 5-factor risk scoring in a single modern cybersecurity ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono">
          <Link
            href="/command-center"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan/30 to-cyber-turquoise/30 hover:from-cyber-cyan/40 hover:to-cyber-turquoise/40 text-cyber-cyan border border-cyber-cyan/60 font-semibold shadow-cyber-cyan text-sm transition-all"
          >
            <span>Enter Security Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/investigations"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyber-card hover:bg-cyber-elevated text-cyber-gold border border-cyber-gold/40 font-semibold shadow-cyber-gold text-sm transition-all"
          >
            <Zap className="w-4 h-4 fill-cyber-gold" />
            <span>Try Live Investigation Demo</span>
          </Link>
        </div>

        {/* Real-Time Live Sensor Ticker */}
        <div className="mt-12 p-4 rounded-xl bg-cyber-navy/80 border border-cyber-card max-w-4xl mx-auto text-xs font-mono flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-critical animate-pulse"></span>
            <span className="text-cyber-muted">Active C2 Telemetry:</span>
            <span className="text-cyber-critical font-bold">185.220.101.5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-muted">MITRE TTP:</span>
            <span className="text-cyber-cyan">T1071.001 (Web C2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-muted">Overall Posture:</span>
            <span className="text-cyber-turquoise font-bold">78.5% (Optimal)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyber-muted">Orchestrator:</span>
            <span className="text-cyber-gold">LangGraph Multi-Agent</span>
          </div>
        </div>
      </section>

      {/* 12 Cybersecurity Domains Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white tracking-wide">
            Twelve Specialized Cybersecurity Domains
          </h2>
          <p className="text-xs sm:text-sm text-cyber-muted font-mono max-w-2xl mx-auto">
            Every cybersecurity domain features its own dedicated dashboard, specialized AI assistant, live statistics, and autonomous remediation workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAIN_CARDS.map((domain) => {
            const Icon = domain.icon;
            return (
              <Link
                key={domain.id}
                href={`/${domain.id}`}
                className="group p-5 rounded-2xl bg-cyber-card/70 hover:bg-cyber-card border border-cyber-card hover:border-cyber-cyan/50 transition-all shadow-lg hover:shadow-cyber-cyan flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyber-deep border border-cyber-card flex items-center justify-center text-cyber-cyan group-hover:text-cyber-white group-hover:border-cyber-cyan transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-cyber-white group-hover:text-cyber-cyan transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-cyber-muted mt-2 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-cyber-deep/80 flex items-center justify-between text-xs font-mono text-cyber-cyan">
                  <span>Open Dedicated Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Autonomous Multi-Agent Orchestration Architecture */}
      <section className="p-8 rounded-3xl bg-cyber-navy/50 border border-cyber-card space-y-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-cyber-cyan uppercase tracking-wider mb-2">Agentic Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white tracking-tight">
            How ThreatGuard Multi-Agent Orchestration Operates
          </h2>
          <p className="text-xs sm:text-sm text-cyber-muted font-mono mt-2">
            Built upon LangGraph principles, the Central Supervisor coordinates specialized agents, enforces Model Context Protocol tool execution, and requires human authorization for destructive mitigations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-2">
            <div className="text-cyber-cyan font-mono text-xs font-bold">01. Central Supervisor</div>
            <p className="text-xs text-cyber-muted">Validates telemetry input, selects domain specialists, and initiates investigation session.</p>
          </div>
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-2">
            <div className="text-cyber-turquoise font-mono text-xs font-bold">02. MCP Tool Execution</div>
            <p className="text-xs text-cyber-muted">Queries AbuseIPDB, URLhaus, NVD, and MITRE ATT&CK via standard MCP tools.</p>
          </div>
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-2">
            <div className="text-cyber-gold font-mono text-xs font-bold">03. 5-Factor Risk Scoring</div>
            <p className="text-xs text-cyber-muted">Computes transparent weighted score: Threat Reputation (35%), Evidence (25%), Recency (15%), Associations (15%), Reliability (10%).</p>
          </div>
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-2">
            <div className="text-cyber-critical font-mono text-xs font-bold">04. Human-in-the-Loop</div>
            <p className="text-xs text-cyber-muted">Destructive containment actions (firewall block, host quarantine) require signed analyst approval.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyber-card via-cyber-elevated to-cyber-card border border-cyber-cyan/40 text-center space-y-6 shadow-cyber-cyan">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-cyber-white">
          Experience Autonomous AI Cybersecurity in Action
        </h2>
        <p className="text-xs sm:text-sm text-cyber-muted font-mono max-w-xl mx-auto">
          Explore the interactive Command Center, test the live domain AI copilot, and watch the multi-agent investigation workflow analyze active threats.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/command-center"
            className="px-6 py-3 rounded-xl bg-cyber-cyan text-cyber-deep font-bold text-xs font-mono shadow-cyber-cyan hover:bg-cyber-cyan/90 transition-colors"
          >
            Launch Command Center
          </Link>
          <Link
            href="/investigations"
            className="px-6 py-3 rounded-xl bg-cyber-deep border border-cyber-card hover:border-cyber-gold text-cyber-gold font-bold text-xs font-mono transition-colors"
          >
            Test Demonstration Investigation
          </Link>
        </div>
      </section>
    </div>
  );
}
