'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import CyberGlobe from '@/components/dashboard/CyberGlobe';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Crosshair,
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
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';
import { OverviewStats, PostureScoreData, ModuleProgress, Alert, Incident } from '@/lib/types';

export default function CommandCenterPage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [posture, setPosture] = useState<PostureScoreData | null>(null);
  const [modules, setModules] = useState<ModuleProgress[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRailOpen, setIsRailOpen] = useState(false);

  useEffect(() => {
    const handleRadarRailToggle = (event: Event) => {
      const { open } = (event as CustomEvent<{ open?: boolean }>).detail ?? {};
      if (typeof open === 'boolean') {
        setIsRailOpen(open);
      }
    };

    window.addEventListener('threatguard:toggle-radar-rail', handleRadarRailToggle);
    return () => window.removeEventListener('threatguard:toggle-radar-rail', handleRadarRailToggle);
  }, []);

  const handleCommandPrompt = async (query: string) => {
    try {
      const result = await api.chatWithAssistant('threat-intelligence', query);
      window.alert(result.response || 'The assistant returned an empty response.');
    } catch (error) {
      console.error('Command Center assistant request failed:', error);
      window.alert('Unable to get a response from the ThreatGuard backend. Please try again.');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, postData, modData, altData, incData] = await Promise.all([
          api.getDashboardOverview(),
          api.getPostureScore(),
          api.getModuleProgress(),
          api.getAlerts(),
          api.getIncidents()
        ]);
        setOverview(ovData);
        setPosture(postData);
        setModules(modData);
        setAlerts(altData);
        setIncidents(incData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ scale: 1.005 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-turquoise animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider font-bold">
              Central Security Command Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide">
            Global Defense Security Posture
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            Autonomous Multi-Agent Monitoring across 12 Cybersecurity Domains
          </p>
        </div>

        {/* Posture Score Radial Badge */}
        <div className="flex items-center space-x-4 bg-cyber-deep/80 border border-cyber-card px-4 py-2.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] font-mono text-cyber-muted uppercase">Health Index</div>
            <div className="text-lg font-bold font-mono text-cyber-white">
              {overview?.posture_score || 78.5} <span className="text-xs text-cyber-turquoise font-normal">/ 100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-cyber-turquoise/50 flex items-center justify-center text-cyber-turquoise font-bold text-sm font-mono shadow-cyber-cyan bg-cyber-navy">
            OPTIMAL
          </div>
        </div>
      </motion.div>

      {/* Top Stats Overview Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } }
        }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>Active Alerts</span>
            <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-white mt-2">
            {overview?.total_active_alerts || 24}
          </div>
          <div className="text-[10px] font-mono text-cyber-critical mt-1 flex items-center gap-1">
            <span>{overview?.critical_alerts || 4} Critical P1</span>
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>Open Incidents</span>
            <AlertTriangle className="w-3.5 h-3.5 text-cyber-critical" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-white mt-2">
            {overview?.open_incidents || 3}
          </div>
          <div className="text-[10px] font-mono text-cyber-gold mt-1">
            2 Assigned to AI Orchestrator
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>Investigations</span>
            <Zap className="w-3.5 h-3.5 text-cyber-gold" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-white mt-2">
            {overview?.investigations_running || 2}
          </div>
          <div className="text-[10px] font-mono text-cyber-turquoise mt-1">
            1 Waiting Human Approval
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>MTTD (Detect)</span>
            <Clock className="w-3.5 h-3.5 text-cyber-turquoise" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-white mt-2">
            {overview?.mttd_minutes || 14} <span className="text-xs font-normal text-cyber-muted">min</span>
          </div>
          <div className="text-[10px] font-mono text-cyber-success mt-1">
            -35% vs Industry Avg
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>MTTR (Respond)</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyber-turquoise" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-white mt-2">
            {overview?.mttr_minutes || 42} <span className="text-xs font-normal text-cyber-muted">min</span>
          </div>
          <div className="text-[10px] font-mono text-cyber-success mt-1">
            Autopilot Playbooks
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.025, y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cyber-card border border-cyber-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-cyber-muted text-xs font-mono">
            <span>Domains Monitored</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-cyan mt-2">
            12 / 12
          </div>
          <div className="text-[10px] font-mono text-cyber-turquoise mt-1">
            100% Sensor Uptime
          </div>
        </motion.div>
      </motion.div>

      <CyberGlobe isRailOpen={isRailOpen} onAskCopilot={handleCommandPrompt} />

      {/* 12 Cybersecurity Domains Posture Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.003 }}
        className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4"
      >
        <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
          <div>
            <h2 className="text-sm font-bold text-cyber-white uppercase tracking-wider font-mono">
              12 Cybersecurity Domain Operational Progress
            </h2>
            <p className="text-xs text-cyber-muted font-mono">
              Calculated dynamically from verified findings, remediation status, and compliance criteria
            </p>
          </div>
          <Link
            href="/solutions"
            className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
          >
            <span>View All Domain Workspaces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modules.map((mod) => (
            <Link
              key={mod.domain}
              href={`/${mod.domain}`}
              className="p-3.5 rounded-xl bg-cyber-deep/80 hover:bg-cyber-elevated/70 border border-cyber-card hover:border-cyber-cyan/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyber-white group-hover:text-cyber-cyan transition-colors truncate max-w-[150px]">
                  {mod.name}
                </span>
                <span className="font-mono text-cyber-turquoise font-bold text-xs">
                  {mod.completion_percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-cyber-navy h-1.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="bg-gradient-to-r from-cyber-cyan to-cyber-turquoise h-full rounded-full transition-all duration-500"
                  style={{ width: `${mod.completion_percentage}%` }}
                ></div>
              </div>

              <div className="mt-2 text-[10px] font-mono text-cyber-muted flex items-center justify-between">
                <span>Verified: {mod.verified_findings}/{mod.total_findings}</span>
                <span className="text-cyber-cyan group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* MITRE ATT&CK Matrix & Live Incident Correlator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incident Queue (2 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4"
        >
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyber-cyan" />
              <h2 className="text-sm font-bold text-cyber-white uppercase tracking-wider font-mono">
                Active SOC Incidents Queue
              </h2>
            </div>
            <Link
              href="/soc"
              className="text-xs font-mono text-cyber-cyan hover:underline"
            >
              Open SOC Workspace →
            </Link>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-cyber-deep/80 border border-cyber-card hover:border-cyber-cyan/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/40 font-bold">
                      {inc.priority}
                    </span>
                    <span className="text-xs font-bold text-cyber-white">{inc.title}</span>
                  </div>
                  <p className="text-xs text-cyber-muted line-clamp-1">{inc.root_cause || 'Telemetry correlation in progress'}</p>
                  <div className="text-[10px] font-mono text-cyber-muted flex items-center gap-3 pt-1">
                    <span>Assigned: <strong className="text-cyber-white">{inc.assigned_to}</strong></span>
                    <span>MTTD: {inc.mttd_minutes}m</span>
                    <span>Status: <strong className="text-cyber-turquoise">{inc.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Link
                    href={`/investigations?target=${encodeURIComponent(inc.id)}`}
                    className="px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan border border-cyber-cyan/40 text-xs font-mono transition-colors"
                  >
                    Investigate
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* MITRE ATT&CK Matrix Mini Preview */}
          <div className="mt-4 pt-4 border-t border-cyber-deep">
            <div className="text-xs font-mono text-cyber-muted mb-2 uppercase flex items-center justify-between">
              <span>Observed MITRE ATT&CK Techniques Heatmap</span>
              <span className="text-cyber-cyan text-[10px]">Matrix v15 Enterprise</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-critical/40">
                <div className="text-cyber-critical font-bold text-[11px]">T1071.001</div>
                <div className="text-cyber-muted text-[10px] truncate">Web Protocols (C2)</div>
                <div className="text-[9px] text-cyber-critical mt-1">High Activity (Active)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-gold/40">
                <div className="text-cyber-gold font-bold text-[11px]">T1566.002</div>
                <div className="text-cyber-muted text-[10px] truncate">Spearphishing Link</div>
                <div className="text-[9px] text-cyber-gold mt-1">Campaign Phish (3 Hits)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-cyan/40">
                <div className="text-cyber-cyan font-bold text-[11px]">T1059.001</div>
                <div className="text-cyber-muted text-[10px] truncate">PowerShell Execution</div>
                <div className="text-[9px] text-cyber-cyan mt-1">EDR Intercepted</div>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-deep border border-cyber-turquoise/40">
                <div className="text-cyber-turquoise font-bold text-[11px]">T1558.003</div>
                <div className="text-cyber-muted text-[10px] truncate">Kerberoasting</div>
                <div className="text-[9px] text-cyber-turquoise mt-1">Account Audited</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Multi-Agent Orchestrator Feed (1 Col) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4"
        >
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyber-gold" />
              <h2 className="text-sm font-bold text-cyber-white uppercase tracking-wider font-mono">
                Agentic Stream
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyber-turquoise px-1.5 py-0.5 rounded bg-cyber-turquoise/10 border border-cyber-turquoise/30">
              Live State
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-cyber-deep border-l-2 border-cyber-cyan space-y-1">
              <div className="text-cyber-cyan font-bold flex items-center justify-between">
                <span>Central AI Supervisor</span>
                <span className="text-[10px] text-cyber-muted">Just now</span>
              </div>
              <p className="text-cyber-muted text-[11px]">
                Dispatched IOC Investigation Agent for indicator <strong className="text-cyber-white">malicious-c2-update.org</strong>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cyber-deep border-l-2 border-cyber-turquoise space-y-1">
              <div className="text-cyber-turquoise font-bold flex items-center justify-between">
                <span>IOC Investigation Agent</span>
                <span className="text-[10px] text-cyber-muted">2m ago</span>
              </div>
              <p className="text-cyber-muted text-[11px]">
                Queried MCP tools: check_ip_reputation (AbuseIPDB 92% abuse confidence).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cyber-deep border-l-2 border-cyber-gold space-y-1">
              <div className="text-cyber-gold font-bold flex items-center justify-between">
                <span>Threat Actor Research Agent</span>
                <span className="text-[10px] text-cyber-muted">5m ago</span>
              </div>
              <p className="text-cyber-muted text-[11px]">
                Correlated adversary APT29 (Cozy Bear) with C2 server fingerprint.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-cyber-deep border-l-2 border-cyber-critical space-y-1">
              <div className="text-cyber-critical font-bold flex items-center justify-between">
                <span>Remediation Planning Agent</span>
                <span className="text-[10px] text-cyber-muted">6m ago</span>
              </div>
              <p className="text-cyber-muted text-[11px]">
                Staged firewall egress block policy. Waiting Human-in-the-Loop approval.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/agents"
              className="w-full py-2.5 rounded-xl bg-cyber-deep hover:bg-cyber-elevated border border-cyber-card hover:border-cyber-gold text-cyber-gold flex items-center justify-center gap-1.5 text-xs font-mono font-semibold transition-colors"
            >
              <span>View Full Agent Topology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
