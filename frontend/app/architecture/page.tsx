'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code,
  Server,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const TECH_STACK = [
  { layer: 'Frontend Framework', tech: 'Next.js 14+ (App Router)', purpose: 'Server and client components with dynamic rendering' },
  { layer: 'UI Library & Types', tech: 'React 18 + TypeScript', purpose: 'Type-safe component-driven user interface' },
  { layer: 'Styling & Design System', tech: 'Tailwind CSS (Cyber Theme)', purpose: 'Deep Navy (#07111F), Cyan, Turquoise, and Gold aesthetics' },
  { layer: 'Backend REST API', tech: 'Python 3.11+ / FastAPI', purpose: 'Asynchronous API routing, Pydantic schemas, and token authentication' },
  { layer: 'Database & ORM', tech: 'PostgreSQL / SQLAlchemy', purpose: 'Multi-tenant relational persistence and audit logging' },
  { layer: 'Agentic Orchestration', tech: 'LangGraph & Supervisor', purpose: 'Multi-agent state machines, evidence graph, and human approval' },
  { layer: 'Tool Standard', tech: 'Model Context Protocol (MCP)', purpose: '12 standard security tools for threat intelligence and SOC triage' },
  { layer: 'AI Reasoning Engine', tech: 'Google Gemini API + Heuristics', purpose: 'Contextual domain-specific cybersecurity assistants' }
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-12 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-cyber-white tracking-tight">
          System Architecture & Tech Stack
        </h1>
        <p className="text-sm text-cyber-muted font-mono leading-relaxed">
          Designed according to modern enterprise cybersecurity standards with multi-tenant isolation, immutable audit logging, and decoupled agentic layers.
        </p>
      </div>

      <div className="rounded-2xl bg-cyber-card border border-cyber-card overflow-hidden">
        <div className="p-4 bg-cyber-navy/80 border-b border-cyber-card text-xs font-mono font-bold text-cyber-white uppercase tracking-wider">
          Technology Specifications Matrix
        </div>
        <div className="divide-y divide-cyber-deep/80 text-xs">
          {TECH_STACK.map((item, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-cyber-elevated/40 transition-colors">
              <div className="font-mono text-cyber-muted min-w-[200px]">{item.layer}</div>
              <div className="font-mono text-cyber-cyan font-semibold min-w-[220px]">{item.tech}</div>
              <div className="text-cyber-white/80">{item.purpose}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
