'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot
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
      <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.25)]">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030305] border border-purple-500/25 text-purple-300 font-bold uppercase">
                {badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
              {details?.title || domainName}
            </h1>
            <p className="text-xs text-zinc-400 font-mono max-w-2xl mt-0.5">
              {details?.description || "Dedicated cybersecurity domain workspace with contextual AI assistance and live telemetry."}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center space-x-4 bg-[#030305]/80 border border-purple-500/15 px-4 py-2.5 rounded-xl self-start md:self-center">
          <div className="text-right font-mono">
            <div className="text-[10px] text-zinc-400 uppercase">Operational Progress</div>
            <div className="text-lg font-bold text-white">
              {details?.progress || 78.5}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs font-mono shadow-[0_0_12px_rgba(147,51,234,0.2)] bg-[#080714]">
            OK
          </div>
        </div>
      </div>

      {/* Domain Statistics Banner */}
      {details?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Object.entries(details.stats).map(([k, v], idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0B0A10] border border-purple-500/15">
              <div className="text-[11px] font-mono text-zinc-400 uppercase truncate">{k}</div>
              <div className="text-xl font-bold font-mono text-white mt-1.5">{String(v)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Findings Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Active Findings & Indicators ({details?.findings?.length || 0})</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300">Monitored Scope</span>
          </div>

          <div className="space-y-2.5">
            {details?.findings?.map((finding: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#030305]/80 border border-purple-500/15 hover:border-purple-500/35 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#080714] border border-purple-500/20 text-zinc-400">
                      {finding.type}
                    </span>
                    <span className="font-bold text-white truncate max-w-xs">{finding.indicator}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                    <span>Source: {finding.source}</span>
                    <span>Status: <strong className="text-purple-300">{finding.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    finding.severity === 'Critical'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                      : 'bg-violet-950/60 text-violet-400 border-violet-500/30'
                  }`}>
                    {finding.severity}
                  </span>
                  <Link
                    href={`/investigations?target=${encodeURIComponent(finding.indicator)}`}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 text-[11px] transition-colors"
                  >
                    Triage
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Tasks */}
          <div className="mt-6 pt-4 border-t border-purple-500/15">
            <div className="text-xs font-mono text-zinc-400 uppercase mb-3 flex items-center justify-between">
              <span>Remediation Tasks</span>
              <span className="text-purple-300 text-[10px]">Active Queue</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {details?.tasks?.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#030305] border border-purple-500/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${t.status === 'Completed' ? 'text-purple-400' : 'text-zinc-500'}`} />
                    <span className="text-white text-xs">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">{t.status}</span>
                    <span className="text-[10px] text-purple-300 font-bold">[{t.priority}]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specialized Domain Copilot & Agents Panel (1 Col) */}
        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Specialist Copilot</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
              Contextual
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#030305] border border-purple-500/15 space-y-2 text-xs">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{details?.title || domainName} Assistant</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Specialized domain prompt instructions and Model Context Protocol tools for {domainName} are primed and loaded in active memory.
            </p>
            <div className="pt-2">
              <Link
                href="/investigations"
                className="inline-flex items-center gap-1.5 text-purple-300 font-mono text-xs hover:text-purple-200 transition-colors"
              >
                <span>Launch investigation from this domain</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Domain Specialist Agents */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-zinc-400 uppercase">Assigned Domain Agents:</div>
            <div className="space-y-1.5 font-mono text-xs">
              {details?.agents?.map((agentName: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#030305] border border-purple-500/15 flex items-center justify-between text-white"
                >
                  <span className="text-xs truncate">{agentName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
