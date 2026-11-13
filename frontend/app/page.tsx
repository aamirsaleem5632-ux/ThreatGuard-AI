'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  Activity,
  Radio,
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
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';

const DOMAIN_CARDS = [
  { id: 'threat-intelligence', title: 'Threat Intelligence', icon: Radio, desc: 'IOC reputation, AbuseIPDB/URLhaus feeds, and adversary attribution.' },
  { id: 'soc', title: 'SOC Operations', icon: Activity, desc: 'Centralized alert monitoring, correlation, and sub-15-minute MTTD/MTTR.' },
  { id: 'vulnerabilities', title: 'Vulnerability Mgmt', icon: Bug, desc: 'CVE intelligence, CVSS v3.1/v4.0 scoring, and EPSS exploit prioritization.' },
  { id: 'application-security', title: 'App & API Security', icon: Code2, desc: 'OWASP Top 10 mitigation, token flaw auditing, and secure API telemetry.' },
  { id: 'cloud-security', title: 'Cloud Security (CSPM)', icon: Cloud, desc: 'Multi-cloud posture management, IAM over-privilege audits, and S3 leaks.' },
  { id: 'identity-security', title: 'Identity & Access (ITDR)', icon: Fingerprint, desc: 'Suspicious login analysis, UEBA impossible travel, and Kerberoasting triage.' },
  { id: 'phishing', title: 'Email & Phishing Intel', icon: MailWarning, desc: 'Domain impersonation, SPF/DKIM verification, and phishing kit forensics.' },
  { id: 'endpoint-security', title: 'Endpoint & EDR Security', icon: Cpu, desc: 'Behavioral ransomware prevention, suspicious process trees, and binary hashes.' },
  { id: 'network-security', title: 'Network Intelligence (NDR)', icon: Network, desc: 'Traffic flow anomalies, DNS tunneling detection, and egress C2 drop policies.' },
  { id: 'supply-chain', title: 'Supply Chain & SBOM', icon: Boxes, desc: 'SBOM component auditing, OSS vulnerability detection, and vendor risk scores.' },
  { id: 'ai-security-module', title: 'AI & Agent Security', icon: Bot, desc: 'Prompt injection defenses, LLM tool boundaries, and agent governance.' },
  { id: 'governance', title: 'GRC & Incident Response', icon: FileCheck2, desc: 'NIST CSF 2.0 & ISO 27001 mapping, policy audits, and certified reporting.' }
];

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030705] flex items-center justify-center font-mono text-zinc-400">
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { t } = useLanguage();

  return (
    <div className="space-y-28 py-10 px-6 lg:px-12 max-w-7xl mx-auto select-none overflow-hidden">
      {/* 1. SentinelSafe Hero Section (Obsidian Aesthetic) */}
      <section className="relative pt-6 pb-12">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -right-16 w-96 h-96 bg-purple-900/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 -left-16 w-96 h-96 bg-violet-800/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07110A] border border-purple-500/25 text-xs font-mono text-purple-300 shadow-[0_0_15px_rgba(104,166,109,0.15)]">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              <span>{t('hero.badge', 'Next-Generation Autonomous Security Operations (ASO)')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {t('hero.titleLine1', 'Secure Your Digital World')}{' '}
              <br />
              <span className="purple-gradient-text drop-shadow-[0_4px_25px_rgba(104,166,109,0.35)]">
                {t('hero.titleLine2', 'Effectively & Autonomously')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-mono leading-relaxed">
              {t(
                'hero.subtitle',
                'Advanced cybersecurity solutions to protect your enterprise data, infrastructure, and identity with 12 autonomous AI copilots and LangGraph orchestration.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 font-mono">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/command-center"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-900/50 via-violet-800/40 to-purple-900/50 hover:brightness-110 text-white font-bold border border-purple-500/35 shadow-[0_0_20px_rgba(104,166,109,0.25)] text-sm transition-all"
                >
                  <span>{t('hero.ctaPrimary', 'Enter Command Center')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/solutions"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#07110A] hover:bg-[#0C1A10] text-white border border-purple-500/15 hover:border-purple-500/40 font-semibold text-sm transition-all shadow-sm"
                >
                  <span>{t('hero.exploreSolutions', 'Explore 12 Domains')}</span>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </Link>
              </motion.div>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-zinc-400 border-t border-purple-500/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>12/12 Domains Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Sub-15m MTTD/MTTR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                <span>Tier 1 SOC Ready</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: Glowing 3D High-Tech Shield Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center select-none"
          >
            {/* Outer Rotating Cyber Rings */}
            <div className="relative w-72 h-88 sm:w-80 sm:h-96 flex items-center justify-center">
              <svg viewBox="0 0 320 380" className="w-full h-full overflow-visible drop-shadow-[0_0_35px_rgba(104,166,109,0.35)]">
                <defs>
                  {/* Metallic Violet & Purple Gradient */}
                  <linearGradient id="shieldPurpleRim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CBE5B9" />
                    <stop offset="35%" stopColor="#A8CE91" />
                    <stop offset="70%" stopColor="#5D9860" />
                    <stop offset="100%" stopColor="#245A34" />
                  </linearGradient>

                  {/* Inner Matte Obsidian Charcoal Gradient */}
                  <linearGradient id="shieldCoreDark" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#0C1A10" />
                    <stop offset="50%" stopColor="#07110A" />
                    <stop offset="100%" stopColor="#030705" />
                  </linearGradient>

                  {/* Glowing Lilac Circuit Accent */}
                  <linearGradient id="circuitPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CBE5B9" />
                    <stop offset="100%" stopColor="#5D9860" />
                  </linearGradient>

                  <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer Ambient Glow Aura */}
                <path
                  d="M 160 20 L 280 75 C 280 215 160 340 160 340 C 160 340 40 215 40 75 Z"
                  fill="none"
                  stroke="#5D9860"
                  strokeWidth="2"
                  opacity="0.3"
                  filter="url(#glowPurple)"
                />

                {/* Main 3D Purple Shield Contour */}
                <path
                  d="M 160 30 L 270 82 C 270 208 160 325 160 325 C 160 325 50 208 50 82 Z"
                  fill="url(#shieldCoreDark)"
                  stroke="url(#shieldPurpleRim)"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />

                {/* Inner Glowing Circuit Shield Rim */}
                <path
                  d="M 160 55 L 245 98 C 245 198 160 290 160 290 C 160 290 75 198 75 98 Z"
                  fill="none"
                  stroke="url(#circuitPurple)"
                  strokeWidth="2.5"
                  opacity="0.85"
                  strokeDasharray="180 8"
                />

                {/* High-Tech Circuit Lines and Node Dots */}
                <circle cx="160" cy="170" r="42" fill="none" stroke="#5D9860" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" className="animate-spin-slow" />

                {/* Cyber Bug / Threat Defense Core Icon */}
                <g transform="translate(132, 142) scale(1.15)">
                  <path
                    d="M 24 6 C 14 6 12 14 12 18 L 12 24 L 36 24 L 36 18 C 36 14 34 6 24 6 Z"
                    fill="none"
                    stroke="#51945A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <rect x="8" y="24" width="32" height="24" rx="4" fill="#0C1A10" stroke="#51945A" strokeWidth="2.5" />
                  <circle cx="24" cy="34" r="3.5" fill="#A4CB94" />
                  <path d="M 24 37 L 24 43" stroke="#A4CB94" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Horizontal Scanning Cyber Ray */}
                <line x1="80" y1="185" x2="240" y2="185" stroke="#51945A" strokeWidth="1.5" opacity="0.75" className="animate-pulse" />
              </svg>

              {/* Floating Orbiting Satellite Badge */}
              <div className="absolute -top-2 right-4 px-3 py-1.5 rounded-full bg-[#0C1A10]/90 border border-purple-500/35 text-purple-300 text-[10px] font-mono shadow-[0_0_15px_rgba(104,166,109,0.2)] flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Zero-Trust Shield Active</span>
              </div>

              {/* Floating Bottom Telemetry Badge */}
              <div className="absolute -bottom-3 left-4 px-3 py-1.5 rounded-full bg-[#0C1A10]/90 border border-purple-500/35 text-purple-300 text-[10px] font-mono shadow-[0_0_15px_rgba(104,166,109,0.2)] flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                <span>14,872 Threats Intercepted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Three Glassmorphism Feature Cards */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Protect Your Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 25px rgba(104, 166, 109, 0.25)',
              borderColor: 'rgba(104, 166, 109, 0.40)'
            }}
            className="cyber-glass p-7 rounded-2xl flex flex-col justify-between shadow-xl group cursor-default"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#08130B] border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(104,166,109,0.2)] group-hover:border-purple-500/50 transition-colors">
                <Lock className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                {t('card.protectPrivacy', 'Protect Your Privacy')}
              </h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {t(
                  'card.protectPrivacyDesc',
                  'Autonomous telemetry encryption, Zero-Trust network shielding, and continuous data leak prevention.'
                )}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-500/15">
              <Link
                href="/endpoint-security"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#030705] border border-purple-500/15 group-hover:border-purple-500/40 text-xs font-mono text-white group-hover:text-purple-300 transition-all"
              >
                <span>{t('hero.learnMore', 'Learn More')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Real-Time Threat Defense (Highlighted active card with glowing purple aura) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 35px rgba(104, 166, 109, 0.35)',
              borderColor: 'rgba(104, 166, 109, 0.6)'
            }}
            className="cyber-glass-purple p-7 rounded-2xl flex flex-col justify-between shadow-[0_0_35px_rgba(104,166,109,0.25)] relative group cursor-default"
          >
            <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
              Primary Defense
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#030705] border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(104,166,109,0.3)]">
                <ShieldAlert className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                {t('card.threatDefense', 'Real-Time Threat Defense')}
              </h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {t(
                  'card.threatDefenseDesc',
                  'Sub-15-minute MTTD/MTTR autonomous multi-agent threat hunting, sandbox detonation, and automated isolation.'
                )}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-500/20">
              <Link
                href="/soc"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/30 to-purple-900/40 border border-purple-500/40 text-xs font-mono font-bold text-purple-200 hover:bg-purple-900/50 transition-all shadow-[0_0_15px_rgba(104,166,109,0.25)]"
              >
                <span>{t('hero.learnMore', 'Learn More')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Secure Your Identity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 25px rgba(98, 153, 91, 0.25)',
              borderColor: 'rgba(98, 153, 91, 0.40)'
            }}
            className="cyber-glass p-7 rounded-2xl flex flex-col justify-between shadow-xl group cursor-default"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#08130B] border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(104,166,109,0.2)] group-hover:border-purple-500/50 transition-colors">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                {t('card.secureIdentity', 'Secure Your Identity')}
              </h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {t(
                  'card.secureIdentityDesc',
                  'Identity threat detection & response (ITDR), Kerberoasting prevention, and impossible-travel login defense.'
                )}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-500/15">
              <Link
                href="/identity-security"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#030705] border border-purple-500/15 group-hover:border-purple-500/40 text-xs font-mono text-white group-hover:text-purple-300 transition-all"
              >
                <span>{t('hero.learnMore', 'Learn More')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Comprehensive Protection Showcase + Laptop SOC Mockup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 sm:p-12 rounded-3xl bg-[#07110A]/90 border border-purple-500/15 space-y-8 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono text-purple-300 uppercase tracking-wider font-bold">
              {t('hero.maxSecurity', '20+ Enterprise Security Defenses Active')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t('hero.comprehensive', 'Comprehensive Protection Against Cyberthreats')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed">
              From endpoint ransomware behavior to cloud IAM policy drifts and LLM prompt injections, ThreatGuard AI delivers complete, synchronized coverage across all attack vectors.
            </p>

            <div className="space-y-3.5 font-mono text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-950/60 border border-purple-500/35 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white">Keep enterprise and infrastructure safe</span>
                  <p className="text-zinc-400 text-[11px]">Autonomous CTI correlation against APT groups and zero-day exploits.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-950/60 border border-purple-500/35 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white">Protect corporate data and transactions</span>
                  <p className="text-zinc-400 text-[11px]">Strict OWASP Top 10 API auditing and financial data leak isolation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-950/60 border border-purple-500/35 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white">Access secure private SOC command telemetry</span>
                  <p className="text-zinc-400 text-[11px]">Real-time MITRE ATT&CK telemetry and transparent 5-factor risk scoring.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/command-center"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/30 to-purple-900/40 hover:from-purple-800/50 hover:to-violet-700/40 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold shadow-[0_0_15px_rgba(104,166,109,0.25)] transition-all"
                >
                  <span>Launch Security Operations Center</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Laptop Preview Mockup displaying the SOC Dashboard */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="lg:col-span-6 relative cursor-default"
          >
            <div className="rounded-2xl border-2 border-purple-500/15 bg-[#030705]/95 p-4 shadow-2xl space-y-3">
              {/* Fake Browser / Laptop Window Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/15 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px]">soc.threatguard.internal/command-center</span>
                <span className="text-purple-300 font-bold">LIVE TELEMETRY</span>
              </div>

              {/* Mini Mock Dashboard Content */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#07110A] border border-purple-500/15">
                    <div className="text-[9px] text-zinc-500">Security Score</div>
                    <div className="text-lg font-bold text-white mt-1">98%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#07110A] border border-purple-500/15">
                    <div className="text-[9px] text-zinc-500">Blocked Threats</div>
                    <div className="text-lg font-bold text-purple-300 mt-1">14,872</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#07110A] border border-purple-500/15">
                    <div className="text-[9px] text-zinc-500">Active Radar</div>
                    <div className="text-lg font-bold text-violet-300 mt-1">983 Sources</div>
                  </div>
                </div>

                {/* Mini Waveform & Attack Volume */}
                <div className="p-3 rounded-lg bg-[#07110A] border border-purple-500/15 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white font-semibold">Attack Volume Trend</span>
                    <span className="text-purple-300">983,421 Events</span>
                  </div>
                  <div className="h-10 flex items-end justify-between gap-1">
                    {[30, 45, 60, 25, 90, 75, 40, 85, 100, 70, 50, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-900 via-purple-600 to-violet-400 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. 12 Cybersecurity Domains Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Twelve Specialized Cybersecurity Domains
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-2xl mx-auto">
            Every cybersecurity domain features its own dedicated dashboard, specialized AI assistant, live statistics, and autonomous remediation workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAIN_CARDS.map((domain) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.id}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(104, 166, 109, 0.25)',
                  borderColor: 'rgba(104, 166, 109, 0.40)'
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="rounded-2xl border border-purple-500/15 bg-[#07110A]/80 flex flex-col justify-between overflow-hidden"
              >
                <Link
                  href={`/${domain.id}`}
                  className="group p-5 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#030705] border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:text-white group-hover:border-purple-500/50 transition-colors mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-mono">
                      {domain.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-purple-500/15 flex items-center justify-between text-xs font-mono text-purple-300">
                    <span>Open Dedicated Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
      <footer className="border-t border-purple-500/15 pt-6 text-center text-xs font-mono text-zinc-400">
        © ThreatGuard AI. All rights reserved.
      </footer>
    </div>
  );
}
