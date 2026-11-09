'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import {
  RotateCw,
  Activity,
  Zap,
  Cpu,
  Radar,
  Radio,
  ShieldCheck,
  Layers
} from 'lucide-react';

const formatNumber = (num: any): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString();
};

interface ThreatIntelSidebarProps {
  className?: string;
  isCollapsible?: boolean;
  onManualRefresh?: () => void;
}

export default function ThreatIntelSidebar({
  className = '',
  isCollapsible = false,
  onManualRefresh
}: ThreatIntelSidebarProps) {
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSources, setActiveSources] = useState(983);
  const [attackVolume, setAttackVolume] = useState(983421);
  const [selectedWindow, setSelectedWindow] = useState<'1H' | '24H' | '7D'>('24H');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Simulated live telemetry fluctuation for realistic SOC monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSources((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setAttackVolume((prev) => prev + Math.floor(Math.random() * 120) - 40);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onManualRefresh?.();
    setTimeout(() => {
      setActiveSources(980 + Math.floor(Math.random() * 15));
      setAttackVolume(983000 + Math.floor(Math.random() * 2000));
      setIsRefreshing(false);
    }, 700);
  };

  // Histogram wave bar data
  const waveBars = [
    { height: 35, delay: '0ms' },
    { height: 55, delay: '120ms' },
    { height: 85, delay: '240ms' },
    { height: 42, delay: '80ms' },
    { height: 95, delay: '300ms' },
    { height: 70, delay: '150ms' },
    { height: 38, delay: '50ms' },
    { height: 62, delay: '200ms' },
    { height: 88, delay: '280ms' },
    { height: 45, delay: '100ms' },
    { height: 92, delay: '320ms' },
    { height: 60, delay: '180ms' },
    { height: 78, delay: '250ms' },
    { height: 50, delay: '90ms' },
    { height: 82, delay: '270ms' },
    { height: 98, delay: '340ms' },
    { height: 65, delay: '160ms' },
    { height: 40, delay: '60ms' },
    { height: 75, delay: '220ms' },
    { height: 90, delay: '310ms' },
    { height: 52, delay: '110ms' },
    { height: 84, delay: '260ms' },
  ];

  return (
    <aside
      className={`bg-[#080714]/95 border-l border-purple-500/15 backdrop-blur-xl flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-14' : 'w-80 lg:w-88'
      } ${className}`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-purple-500/15 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#030305] border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.25)]">
              <Radar className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider font-mono flex items-center gap-1.5">
                <span>{t('soc.globalThreatRadar', 'Global Threat Radar')}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                <span>Telemetry Rail Active</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualRefresh}
            title="Refresh Telemetry"
            className={`w-7 h-7 rounded-lg bg-[#0B0A10] border border-purple-500/15 hover:border-purple-500/40 flex items-center justify-center text-zinc-400 hover:text-purple-300 transition-all ${
              isRefreshing ? 'rotate-180 text-purple-300' : ''
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </motion.button>

          {isCollapsible && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-7 h-7 rounded-lg bg-[#0B0A10] border border-purple-500/15 hover:border-purple-500/40 flex items-center justify-center text-zinc-400 hover:text-purple-300 transition-colors text-xs font-mono"
            >
              {isCollapsed ? '«' : '»'}
            </motion.button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar text-xs font-mono">
          {/* Time Window Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#030305] border border-purple-500/15 text-[11px] text-center">
            {(['1H', '24H', '7D'] as const).map((win) => (
              <motion.button
                key={win}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedWindow(win)}
                className={`py-1 rounded font-semibold transition-all ${
                  selectedWindow === win
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {win}
              </motion.button>
            ))}
          </div>

          {/* 1. Global Threat Radar (Obsidian Purple Arc Gauge) */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
              borderColor: 'rgba(147, 51, 234, 0.40)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-4 rounded-xl bg-[#0B0A10]/90 border border-purple-500/15 transition-all space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('soc.globalThreatRadar', 'Global Threat Radar')}</span>
              </span>
              <span className="text-[10px] text-purple-300 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-500/30">
                Live
              </span>
            </div>

            {/* SVG Arc Gauge */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <svg viewBox="0 0 200 115" className="w-48 overflow-visible">
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D8B4FE" />
                    <stop offset="35%" stopColor="#C084FC" />
                    <stop offset="70%" stopColor="#A855F7" />
                    <stop offset="90%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                  <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Track Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#0F0E18"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                {/* Active Threat Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#arcGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset="45"
                  filter="url(#arcGlow)"
                  className="transition-all duration-1000"
                />

                {/* Tick Marks */}
                <circle cx="20" cy="100" r="2.5" fill="#D8B4FE" />
                <circle cx="100" cy="20" r="2.5" fill="#A855F7" />
                <circle cx="180" cy="100" r="2.5" fill="#F43F5E" />
              </svg>

              {/* Center Counter */}
              <div className="text-center -mt-9">
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {formatNumber(activeSources)}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
                  {t('soc.activeThreatSources', 'Active Threat Sources')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-500/15 text-[10px] text-zinc-400">
              <span>Risk Severity: <strong className="text-purple-300 font-bold">ELEVATED</strong></span>
              <span className="text-purple-400 font-bold">+12.4% vs 1h</span>
            </div>
          </motion.div>

          {/* 2. Attack Volume Trend (Obsidian Purple Waveform) */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
              borderColor: 'rgba(147, 51, 234, 0.40)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-4 rounded-xl bg-[#0B0A10]/90 border border-purple-500/15 transition-all space-y-2.5 cursor-default"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('soc.attackVolumeTrend', 'Attack Volume Trend')}</span>
              </span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleManualRefresh}
                className="text-zinc-400 hover:text-white"
              >
                <RotateCw className="w-3 h-3" />
              </motion.button>
            </div>

            <div className="text-xl font-bold font-mono text-white">
              {formatNumber(attackVolume)}{' '}
              <span className="text-[10px] font-normal text-zinc-400">Events</span>
            </div>

            {/* Dynamic Waveform Bars with Purple Gradient */}
            <div className="h-16 flex items-end justify-between gap-1 pt-1 pb-1 px-1 bg-[#030305]/80 rounded-lg border border-purple-500/15">
              {waveBars.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-purple-900 via-purple-600 to-violet-400 rounded-t-sm transition-all duration-300 hover:brightness-125"
                  style={{
                    height: `${bar.height}%`,
                    animationDelay: bar.delay,
                  }}
                  title={`Hour ${idx}: ${(attackVolume / 24 + idx * 80).toFixed(0)} events`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-0.5">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>NOW</span>
            </div>
          </motion.div>

          {/* 3. AI Threat Detection Breakdown (4-Pill Counters) */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
              borderColor: 'rgba(147, 51, 234, 0.40)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-4 rounded-xl bg-[#0B0A10]/90 border border-purple-500/15 space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('soc.aiThreatDetection', 'AI Threat Detection')}</span>
              </span>
              <span className="text-[10px] text-purple-300 font-mono">Real-Time</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(244, 63, 94, 0.35)' }}
                className="p-2.5 rounded-lg bg-[#030305]/90 border border-rose-500/30 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{t('soc.highRisk', 'High Risk')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                </div>
                <div className="text-lg font-bold text-rose-400 font-mono">89</div>
                <div className="text-[9px] text-zinc-500">Critical Infiltrations</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(245, 158, 11, 0.35)' }}
                className="p-2.5 rounded-lg bg-[#030305]/90 border border-violet-500/25 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{t('soc.mediumRisk', 'Medium')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-lg font-bold text-violet-400 font-mono">215</div>
                <div className="text-[9px] text-zinc-500">Anomaly Alerts</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(147, 51, 234, 0.35)' }}
                className="p-2.5 rounded-lg bg-[#030305]/90 border border-purple-500/25 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{t('soc.lowRisk', 'Low')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                </div>
                <div className="text-lg font-bold text-purple-300 font-mono">1,203</div>
                <div className="text-[9px] text-zinc-500">Passive Probes</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(139, 92, 246, 0.35)' }}
                className="p-2.5 rounded-lg bg-[#030305]/90 border border-violet-500/25 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">{t('soc.resolved', 'Resolved')}</span>
                  <ShieldCheck className="w-3 h-3 text-violet-300" />
                </div>
                <div className="text-lg font-bold text-violet-300 font-mono">532</div>
                <div className="text-[9px] text-zinc-500">Auto-Quarantined</div>
              </motion.div>
            </div>
          </motion.div>

          {/* 4. AI Confidence Progress Meters */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
              borderColor: 'rgba(147, 51, 234, 0.40)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-4 rounded-xl bg-[#0B0A10]/90 border border-purple-500/15 space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('soc.aiConfidence', 'AI Confidence')}</span>
              </span>
              <span className="text-[10px] text-purple-300 font-mono">LangGraph</span>
            </div>

            <div className="space-y-2.5">
              {/* Malware Classification */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-zinc-400">{t('soc.malwareClassification', 'Malware Classification')}</span>
                  <span className="font-bold text-purple-300">97%</span>
                </div>
                <div className="w-full bg-[#030305] h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '97%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-purple-600 to-violet-500 h-full rounded-full shadow-[0_0_10px_rgba(147,51,234,0.4)]"
                  />
                </div>
              </div>

              {/* Anomaly Detection */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-zinc-400">{t('soc.anomalyDetection', 'Anomaly Detection')}</span>
                  <span className="font-bold text-violet-300">94%</span>
                </div>
                <div className="w-full bg-[#030305] h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className="bg-gradient-to-r from-violet-600 to-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                  />
                </div>
              </div>

              {/* Threat Attribution */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-zinc-400">{t('soc.threatAttribution', 'Threat Attribution')}</span>
                  <span className="font-bold text-purple-300">89%</span>
                </div>
                <div className="w-full bg-[#030305] h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '89%' }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="bg-gradient-to-r from-purple-600 to-violet-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. Autonomous Security Workflow Pipeline */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-3.5 rounded-xl bg-gradient-to-b from-[#030305]/95 to-[#0B0A10] border border-purple-500/25 space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Active SOAR Playbook</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-4 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-[9px] text-purple-300">1</span>
                <span>Ingest: AbuseIPDB & URLhaus</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-4 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-[9px] text-purple-300">2</span>
                <span>Correlate: MITRE T1071.001</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <span className="w-4 h-4 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-[9px] text-purple-200">3</span>
                <span>Triage: Human-in-the-Loop Gate</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </aside>
  );
}
