'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  Radio,
  Crosshair,
  Bug,
  Code2,
  Cloud,
  Fingerprint,
  MailWarning,
  Cpu,
  Network,
  Boxes,
  Bot,
  FileCheck2,
  SearchCode,
  GitBranch,
  Network as GraphIcon,
  FileText,
  Settings,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const domainLinks = [
  { href: '/threat-intelligence', label: 'Threat Intelligence', icon: Radio, badge: 'CTI' },
  { href: '/soc', label: 'SOC Operations', icon: Crosshair, badge: 'P1: 4' },
  { href: '/vulnerabilities', label: 'Vulnerability Mgmt', icon: Bug, badge: 'NVD' },
  { href: '/application-security', label: 'Application & API', icon: Code2, badge: 'OWASP' },
  { href: '/cloud-security', label: 'Cloud Security', icon: Cloud, badge: 'CSPM' },
  { href: '/identity-security', label: 'Identity & Access', icon: Fingerprint, badge: 'ITDR' },
  { href: '/phishing', label: 'Email & Phishing', icon: MailWarning, badge: 'Fraud' },
  { href: '/endpoint-security', label: 'Endpoint & Malware', icon: Cpu, badge: 'EDR' },
  { href: '/network-security', label: 'Network Intelligence', icon: Network, badge: 'NDR' },
  { href: '/supply-chain', label: 'Supply Chain & SBOM', icon: Boxes, badge: 'CVE' },
  { href: '/ai-security-module', label: 'AI & Agent Security', icon: Bot, badge: 'LLM' },
  { href: '/governance', label: 'GRC & Incident Resp', icon: FileCheck2, badge: 'NIST' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 bg-cyber-navy border-r border-cyber-card flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Brand Logo */}
      <div className="p-5 border-b border-cyber-card flex items-center justify-between">
        <Link href="/command-center" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-cyber-deep border border-cyber-cyan/40 flex items-center justify-center shadow-cyber-cyan group-hover:border-cyber-cyan transition-colors">
            <ShieldAlert className="w-6 h-6 text-cyber-cyan" />
          </div>
          <div>
            <div className="text-cyber-white font-bold tracking-wider text-base flex items-center gap-1.5">
              THREATGUARD <span className="text-cyber-cyan text-xs font-mono px-1 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30">AI</span>
            </div>
            <p className="text-cyber-muted text-xs font-mono">SOC Orchestration</p>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {/* Core Command Center */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-cyber-muted uppercase px-3 mb-2 flex items-center justify-between">
            <span>Executive Command</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-turquoise animate-pulse"></span>
          </div>
          <Link
            href="/command-center"
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/command-center')
                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 shadow-cyber-cyan'
                : 'text-cyber-white/80 hover:bg-cyber-card hover:text-cyber-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-4 h-4 text-cyber-cyan" />
              <span>Command Center</span>
            </div>
            <span className="text-xs font-mono bg-cyber-card px-2 py-0.5 rounded text-cyber-turquoise border border-cyber-card">78.5%</span>
          </Link>
        </div>

        {/* 12 Cybersecurity Domains */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-cyber-muted uppercase px-3 mb-2 flex items-center justify-between">
            <span>12 Security Domains</span>
            <span className="text-[10px] text-cyber-cyan font-mono">12/12 ACTIVE</span>
          </div>
          <div className="space-y-1">
            {domainLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 font-semibold shadow-cyber-cyan'
                      : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyber-cyan' : 'text-cyber-muted'}`} />
                    <span className="truncate max-w-[130px]">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    active
                      ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                      : 'bg-cyber-deep border-cyber-card text-cyber-muted'
                  }`}>
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Autonomous AI & Investigation */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-cyber-muted uppercase px-3 mb-2">
            AI & Multi-Agent
          </div>
          <div className="space-y-1">
            <Link
              href="/investigations"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive('/investigations')
                  ? 'bg-cyber-gold/15 text-cyber-gold border border-cyber-gold/30 shadow-cyber-gold'
                  : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <SearchCode className="w-3.5 h-3.5 text-cyber-gold" />
                <span>Investigations</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30">DEMO</span>
            </Link>

            <Link
              href="/agents"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive('/agents')
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <GitBranch className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Agent Activity</span>
              </div>
              <span className="text-[10px] font-mono text-cyber-turquoise">6 Active</span>
            </Link>

            <Link
              href="/graph"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive('/graph')
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <GraphIcon className="w-3.5 h-3.5 text-cyber-turquoise" />
                <span>Cyber Graph</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Management */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-cyber-muted uppercase px-3 mb-2">
            Operations & Reports
          </div>
          <div className="space-y-1">
            <Link
              href="/reports"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive('/reports')
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-3.5 h-3.5 text-cyber-muted" />
                <span>Executive Reports</span>
              </div>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive('/settings')
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-cyber-white/70 hover:bg-cyber-card hover:text-cyber-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Settings className="w-3.5 h-3.5 text-cyber-muted" />
                <span>Settings & MCP</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Return to Public Site */}
      <div className="p-3 border-t border-cyber-card bg-cyber-deep/80">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-cyber-muted hover:text-cyber-cyan hover:bg-cyber-card transition-colors font-mono"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Portal</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
