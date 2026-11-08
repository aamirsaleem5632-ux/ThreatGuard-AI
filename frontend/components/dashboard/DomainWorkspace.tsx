'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Terminal,
  Clock,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';

interface DomainWorkspaceProps {
  domainId: string;
  domainName: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DomainWorkspace({ domainId, domainName, badge, icon: Icon }: DomainWorkspaceProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDomain() {
      try {
        const data = await api.getModuleDetails(domainId);
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDomain();
  }, [domainId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Domain Header Banner */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-deep border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-cyber-cyan">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-turquoise animate-pulse"></span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-deep border border-cyber-cyan/30 text-cyber-cyan font-bold uppercase">
                {badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
              {details?.title || domainName}
            </h1>
            <p className="text-xs text-cyber-muted font-mono max-w-2xl mt-0.5">
              {details?.description || "Dedicated cybersecurity domain workspace with contextual AI assistance and live telemetry."}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center space-x-4 bg-cyber-deep/80 border border-cyber-card px-4 py-2.5 rounded-xl self-start md:self-center">
          <div className="text-right font-mono">
            <div className="text-[10px] text-cyber-muted uppercase">Operational Progress</div>
            <div className="text-lg font-bold text-cyber-white">
              {details?.progress || 78.5}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-cyber-turquoise/50 flex items-center justify-center text-cyber-turquoise font-bold text-xs font-mono shadow-cyber-cyan bg-cyber-navy">
            OK
          </div>
        </div>
      </div>

      {/* Domain Statistics Banner */}
      {details?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Object.entries(details.stats).map(([k, v], idx) => (
            <div key={idx} className="p-4 rounded-xl bg-cyber-card border border-cyber-card">
              <div className="text-[11px] font-mono text-cyber-muted uppercase truncate">{k}</div>
              <div className="text-xl font-bold font-mono text-cyber-white mt-1.5">{String(v)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Findings Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyber-white uppercase">
              <Activity className="w-4 h-4 text-cyber-cyan" />
              <span>Active Findings & Indicators ({details?.findings?.length || 0})</span>
            </div>
            <span className="text-[10px] font-mono text-cyber-turquoise">Monitored Scope</span>
          </div>

          <div className="space-y-2.5">
            {details?.findings?.map((finding: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-cyber-deep/80 border border-cyber-card hover:border-cyber-cyan/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-navy border border-cyber-card text-cyber-muted">
                      {finding.type}
                    </span>
                    <span className="font-bold text-cyber-white truncate max-w-xs">{finding.indicator}</span>
                  </div>
                  <div className="text-[11px] text-cyber-muted flex items-center gap-3">
                    <span>Source: {finding.source}</span>
                    <span>Status: <strong className="text-cyber-turquoise">{finding.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    finding.severity === 'Critical'
                      ? 'bg-cyber-critical/20 text-cyber-critical border-cyber-critical/40'
                      : 'bg-cyber-warning/20 text-cyber-warning border-cyber-warning/40'
                  }`}>
                    {finding.severity}
                  </span>
                  <Link
                    href={`/investigations?target=${encodeURIComponent(finding.indicator)}`}
                    className="px-2.5 py-1 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan border border-cyber-cyan/40 text-[11px]"
                  >
                    Triage
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Tasks */}
          <div className="mt-6 pt-4 border-t border-cyber-deep">
            <div className="text-xs font-mono text-cyber-muted uppercase mb-3 flex items-center justify-between">
              <span>Remediation Tasks</span>
              <span className="text-cyber-gold text-[10px]">Active Queue</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {details?.tasks?.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-cyber-deep border border-cyber-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${t.status === 'Completed' ? 'text-cyber-turquoise' : 'text-cyber-muted'}`} />
                    <span className="text-cyber-white text-xs">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyber-muted">{t.status}</span>
                    <span className="text-[10px] text-cyber-cyan font-bold">[{t.priority}]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specialized Domain Copilot & Agents Panel (1 Col) */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyber-white uppercase">
              <Bot className="w-4 h-4 text-cyber-gold" />
              <span>Specialist Copilot</span>
            </div>
            <span className="text-[10px] font-mono text-cyber-gold bg-cyber-gold/15 px-1.5 py-0.5 rounded border border-cyber-gold/30">
              Contextual
            </span>
          </div>

          <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2 text-xs">
            <div className="font-bold text-cyber-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
              <span>{details?.title || domainName} Assistant</span>
            </div>
            <p className="text-cyber-muted text-xs leading-relaxed">
              Specialized domain prompt instructions and Model Context Protocol tools for {domainName} are primed and loaded in active memory.
            </p>
            <div className="pt-2">
              <Link
                href="/investigations"
                className="inline-flex items-center gap-1.5 text-cyber-cyan font-mono text-xs hover:underline"
              >
                <span>Launch investigation from this domain</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Domain Specialist Agents */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-cyber-muted uppercase">Assigned Domain Agents:</div>
            <div className="space-y-1.5 font-mono text-xs">
              {details?.agents?.map((agentName: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-card flex items-center justify-between text-cyber-white"
                >
                  <span className="text-xs truncate">{agentName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-turquoise animate-pulse"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
