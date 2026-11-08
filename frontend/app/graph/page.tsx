'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Network,
  Search,
  Filter,
  ShieldAlert,
  Radio,
  Bug,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const GRAPH_NODES = [
  { id: 'c2-domain', label: 'malicious-c2-update.org', type: 'Domain', risk: 'Critical', color: 'border-cyber-critical text-cyber-critical', desc: 'Fast-flux C2 DNS registrant' },
  { id: 'ip-185', label: '185.220.101.5', type: 'IP Address', risk: 'Critical', color: 'border-cyber-critical text-cyber-critical', desc: 'Bulletproof Russian hosting / Tor exit' },
  { id: 'actor-apt29', label: 'APT29 (Cozy Bear)', type: 'Threat Actor', risk: 'Critical', color: 'border-cyber-gold text-cyber-gold', desc: 'Russian Foreign Intelligence Service (SVR)' },
  { id: 'malware-cobalt', label: 'Cobalt Strike Beacon', type: 'Malware Family', risk: 'Critical', color: 'border-cyber-critical text-cyber-critical', desc: 'Weaponized HTTPS egress stager' },
  { id: 'technique-t1071', label: 'T1071.001 - Web Protocols', type: 'MITRE Technique', risk: 'High', color: 'border-cyber-cyan text-cyber-cyan', desc: 'Application Layer C2 communication' },
  { id: 'cve-moniker', label: 'CVE-2024-21413', type: 'Vulnerability', risk: 'Critical', color: 'border-cyber-critical text-cyber-critical', desc: 'Microsoft Moniker Link RCE Bug' },
  { id: 'asset-db', label: 'prod-db-cluster-01', type: 'Internal Asset', risk: 'Medium', color: 'border-cyber-turquoise text-cyber-turquoise', desc: 'Database host targeted during lateral movement' },
  { id: 'incident-1', label: 'INC-8492: Multi-Stage C2', type: 'SOC Incident', risk: 'Critical', color: 'border-cyber-critical text-cyber-critical', desc: 'Correlated P1 incident session' }
];

const GRAPH_LINKS = [
  { source: 'malicious-c2-update.org', target: '185.220.101.5', rel: 'RESOLVES_TO' },
  { source: 'malicious-c2-update.org', target: 'APT29 (Cozy Bear)', rel: 'ATTRIBUTED_TO' },
  { source: '185.220.101.5', target: 'Cobalt Strike Beacon', rel: 'HOSTS_PAYLOAD' },
  { source: 'APT29 (Cozy Bear)', target: 'T1071.001 - Web Protocols', rel: 'USES_TTP' },
  { source: 'Cobalt Strike Beacon', target: 'prod-db-cluster-01', rel: 'TARGETS_HOST' },
  { source: 'INC-8492: Multi-Stage C2', target: 'malicious-c2-update.org', rel: 'ORIGINATED_FROM' }
];

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<any>(GRAPH_NODES[0]);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredNodes = GRAPH_NODES.filter(n =>
    n.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    n.type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-turquoise animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-turquoise uppercase tracking-wider font-bold">
              Shared Cyber Intelligence Graph
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
            Forensic Relationship & Telemetry Graph
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            Section 14: Cross-Module Provenance mapping Indicators, Actors, Malware, and Enterprise Assets
          </p>
        </div>

        {/* Search within Graph */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter graph nodes..."
            className="w-full bg-cyber-deep border border-cyber-card rounded-lg pl-9 pr-3 py-2 text-xs text-cyber-white placeholder-cyber-muted font-mono focus:outline-none focus:border-cyber-cyan"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Workbench (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyber-white uppercase">
              <Network className="w-4 h-4 text-cyber-cyan" />
              <span>Connected Forensic Nodes ({filteredNodes.length})</span>
            </div>
            <span className="text-[10px] font-mono text-cyber-muted">Click node to inspect relationships</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-cyber-deep border-cyber-cyan shadow-cyber-cyan'
                      : 'bg-cyber-deep/70 hover:bg-cyber-deep border-cyber-card'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-navy border border-cyber-card text-cyber-muted">
                      {node.type}
                    </span>
                    <span className={`text-[10px] font-bold ${node.risk === 'Critical' ? 'text-cyber-critical' : 'text-cyber-cyan'}`}>
                      {node.risk}
                    </span>
                  </div>
                  <div className="font-bold text-xs font-mono text-cyber-white mt-2 truncate">
                    {node.label}
                  </div>
                  <p className="text-[11px] text-cyber-muted mt-1 line-clamp-1">{node.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Connected Edges */}
          <div className="mt-6 pt-4 border-t border-cyber-deep">
            <div className="text-xs font-mono text-cyber-muted uppercase mb-3">
              Explicit Provenance Links ({GRAPH_LINKS.length}):
            </div>
            <div className="space-y-2">
              {GRAPH_LINKS.map((link, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-card font-mono text-xs flex items-center justify-between"
                >
                  <span className="text-cyber-white truncate max-w-[140px] sm:max-w-[180px]">{link.source}</span>
                  <span className="text-[10px] text-cyber-cyan bg-cyber-navy px-2 py-0.5 rounded border border-cyber-cyan/30">
                    --[{link.rel}]--&gt;
                  </span>
                  <span className="text-cyber-turquoise truncate max-w-[140px] sm:max-w-[180px]">{link.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Details Panel (1 Col) */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <span className="font-mono text-xs font-bold text-cyber-white uppercase">Node Inspector</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
              {selectedNode?.type}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <span className="text-cyber-muted text-[10px] uppercase">Entity Identifier:</span>
              <div className="text-sm font-bold text-cyber-white break-all mt-0.5">{selectedNode?.label}</div>
            </div>

            <div>
              <span className="text-cyber-muted text-[10px] uppercase">Risk Classification:</span>
              <div className="text-cyber-critical font-bold mt-0.5">{selectedNode?.risk} Severity</div>
            </div>

            <div>
              <span className="text-cyber-muted text-[10px] uppercase">Telemetry Context:</span>
              <div className="text-cyber-white/90 leading-relaxed font-sans mt-0.5">{selectedNode?.desc}</div>
            </div>

            <div className="pt-4 border-t border-cyber-deep space-y-2">
              <span className="text-cyber-muted text-[10px] uppercase">Cross-Module Actions:</span>
              <Link
                href={`/investigations?target=${encodeURIComponent(selectedNode?.label || '')}`}
                className="w-full py-2 px-3 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/40 flex items-center justify-between transition-colors"
              >
                <span>Launch Autonomous Triage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
