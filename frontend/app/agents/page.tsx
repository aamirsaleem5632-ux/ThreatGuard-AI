'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Bot,
  Terminal,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '@/lib/api';

const REGISTERED_AGENTS = [
  { name: 'Central AI Supervisor', role: 'Orchestration & Routing', status: 'Active', load: '12% CPU' },
  { name: 'IOC Investigation Agent', role: 'Telemetry & Feed Queries', status: 'Active', load: '18% CPU' },
  { name: 'Threat Actor Research Agent', role: 'Adversary & TTP Attribution', status: 'Active', load: '9% CPU' },
  { name: 'Evidence Correlation Agent', role: 'Forensic Graph Synthesis', status: 'Active', load: '14% CPU' },
  { name: 'Remediation Planning Agent', role: 'Playbook Formulation & Governance', status: 'Active', load: '6% CPU' },
  { name: 'Intelligence Reporting Agent', role: 'Certified Brief Generation', status: 'Active', load: '4% CPU' }
];

export default function AgentsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgentsData() {
      try {
        const invs = await api.getInvestigations();
        if (invs.length > 0 && invs[0].agent_runs) {
          setRuns(invs[0].agent_runs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAgentsData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider font-bold">
              Multi-Agent Orchestration Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
            Autonomous Specialist Agents & Tool Execution
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            LangGraph Supervisor pattern coordinating domain agents via Model Context Protocol (MCP)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-cyber-deep border border-cyber-cyan/40 text-xs font-mono text-cyber-cyan">
            6 Specialized Agents Online
          </div>
        </div>
      </div>

      {/* Agents Topology Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGISTERED_AGENTS.map((agent, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-cyber-card border border-cyber-card hover:border-cyber-cyan/40 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyber-cyan" />
                <span className="font-bold text-cyber-white">{agent.name}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-cyber-turquoise animate-ping"></span>
            </div>
            <p className="text-xs text-cyber-muted">{agent.role}</p>
            <div className="pt-2 border-t border-cyber-deep flex items-center justify-between text-[11px] font-mono text-cyber-muted">
              <span>Status: <strong className="text-cyber-turquoise">{agent.status}</strong></span>
              <span>Load: {agent.load}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Agent Execution Logs */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
        <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyber-white uppercase">
            <Terminal className="w-4 h-4 text-cyber-turquoise" />
            <span>Autonomous Tool Execution Log</span>
          </div>
          <span className="text-[10px] font-mono text-cyber-muted">Synchronized with Backend SQLite/PostgreSQL</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {runs.map((run, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyber-cyan">{run.agent_name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-turquoise/20 text-cyber-turquoise border border-cyber-turquoise/30">
                  {run.status}
                </span>
              </div>
              <p className="text-cyber-muted leading-relaxed whitespace-pre-wrap">{run.logs}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
