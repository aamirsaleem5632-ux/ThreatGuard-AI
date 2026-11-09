'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
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
  return (
    <Suspense fallback={
      <aside className="w-72 bg-[#080714]/95 border-r border-purple-500/15 backdrop-blur-xl h-screen fixed left-0 top-0 z-40" />
    }>
      <SidebarInner />
    </Suspense>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 bg-[#080714]/95 border-r border-purple-500/15 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Brand Logo with Obsidian Purple Glow */}
      <div className="p-4 border-b border-purple-500/15 flex items-center justify-between">
        <Link href="/command-center" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.25)] group-hover:border-purple-500/50 transition-colors">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wider text-base flex items-center gap-1.5 font-sans">
              THREATGUARD <span className="text-purple-300 text-xs font-mono px-1 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">AI</span>
            </div>
            <p className="text-zinc-400 text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Autonomous SOC</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {/* Core Command Center */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase px-3 mb-2 flex items-center justify-between">
            <span>{t('nav.executiveCommand', 'Executive Command')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          </div>
          <Link
            href="/command-center"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-none ${
              isActive('/command-center')
                ? 'bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)] font-bold'
                : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>{t('nav.commandCenter', 'Command Center')}</span>
            </div>
            <span className="text-xs font-mono bg-[#0B0A10] px-2 py-0.5 rounded text-purple-300 border border-purple-500/15">78.5%</span>
          </Link>
        </div>

        {/* 12 Cybersecurity Domains */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase px-3 mb-2 flex items-center justify-between">
            <span>{t('nav.securityDomains', '12 Security Domains')}</span>
            <span className="text-[10px] text-purple-400 font-mono">12/12 ACTIVE</span>
          </div>
          <div className="space-y-1">
            {domainLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                    active
                      ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 font-semibold shadow-[0_0_12px_rgba(147,51,234,0.15)]'
                      : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span className="truncate max-w-[130px]">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    active
                      ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                      : 'bg-[#030305] border-purple-500/15 text-zinc-400'
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
          <div className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase px-3 mb-2">
            {t('nav.aiMultiAgent', 'AI & Multi-Agent')}
          </div>
          <div className="space-y-1">
            <Link
              href="/investigations"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                isActive('/investigations')
                  ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)] font-bold'
                  : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <SearchCode className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('nav.investigations', 'Investigations')}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">DEMO</span>
            </Link>

            <Link
              href="/agents"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                isActive('/agents')
                  ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 font-semibold'
                  : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('nav.agentActivity', 'Agent Activity')}</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300">6 Active</span>
            </Link>

            <Link
              href="/graph"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                isActive('/graph')
                  ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 font-semibold'
                  : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Network className="w-3.5 h-3.5 text-violet-400" />
                <span>{t('nav.cyberGraph', 'Cyber Graph')}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Management */}
        <div>
          <div className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase px-3 mb-2">
            {t('nav.reports', 'Operations & Reports')}
          </div>
          <div className="space-y-1">
            <Link
              href="/reports"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                isActive('/reports')
                  ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 font-semibold'
                  : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('nav.reports', 'Executive Reports')}</span>
              </div>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-none ${
                isActive('/settings')
                  ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30 font-semibold'
                  : 'text-zinc-300 hover:bg-[#0B0A10] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('nav.settings', 'Settings & MCP')}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Return to Public Site */}
      <div className="relative p-3 border-t border-purple-500/15 bg-[#030305]/95 overflow-hidden">
        {/* Ambient Fluid Purple/Violet Wave at bottom-left */}
        <div className="absolute -bottom-6 -left-6 w-32 h-24 pointer-events-none opacity-40 blur-[1px]">
          <svg viewBox="0 0 120 90" fill="none" className="w-full h-full">
            <path
              d="M -10 90 C 20 70, 30 35, 65 50 C 95 62, 110 30, 130 10 L 130 90 Z"
              fill="url(#sidebarPurpleWave)"
            />
            <defs>
              <linearGradient id="sidebarPurpleWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <Link
          href="/"
          className="relative z-10 flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-purple-300 hover:bg-[#0B0A10] transition-none font-mono"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('nav.publicPortal', 'Public Portal')}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
