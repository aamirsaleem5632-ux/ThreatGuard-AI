'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  Bot,
  Send,
  Compass
} from 'lucide-react';

// Dynamic import of Three.js WebGL canvas to guarantee zero SSR hydration issues
const WebGLCyberGlobe = dynamic(
  () => import('@/components/dashboard/WebGLCyberGlobe'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] rounded-xl bg-[#030305]/80 border border-purple-500/15 flex flex-col items-center justify-center font-mono text-xs text-zinc-400 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="text-purple-300 font-bold">Initializing Three.js WebGL Engine...</span>
        </div>
        <p className="text-[10px] text-zinc-500">Loading shaders, wireframe geometry, and emissive lighting</p>
      </div>
    )
  }
);

interface CyberGlobeProps {
  onAskCopilot?: (query: string) => void;
  isRailOpen?: boolean;
}

export default function CyberGlobe({ onAskCopilot, isRailOpen = false }: CyberGlobeProps) {
  const { t } = useLanguage();
  const [promptText, setPromptText] = useState('');
  const [activeScrubber, setActiveScrubber] = useState(48); // % position of the timeline cursor
  const [cameraCentered, setCameraCentered] = useState(false);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    if (onAskCopilot) {
      onAskCopilot(promptText);
    }
    setPromptText('');
  };

  const handleRecenterCamera = () => {
    setCameraCentered((prev) => !prev);
    // Dispatch global event to sync with WebGL canvas
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('threatguard:toggle-radar-rail', { detail: { open: !cameraCentered } })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative rounded-2xl bg-[#0B0A10]/90 border border-purple-500/15 overflow-hidden shadow-2xl p-5 space-y-5"
    >
      {/* Background subtle obsidian purple radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(147,51,234,0.12)_0%,rgba(3,3,5,0.95)_75%)] pointer-events-none" />

      {/* Main Visualizer Stage */}
      <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-4 items-center min-h-[340px]">
        {/* Left Mini-Widget: Threat Activity Timeline */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.25)',
            borderColor: 'rgba(147, 51, 234, 0.40)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="lg:col-span-1 p-3.5 rounded-xl bg-[#030305]/85 border border-purple-500/15 space-y-2 z-10 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-white font-bold tracking-wider">
              {t('soc.threatActivityTimeline', 'Threat Activity')}
            </span>
            <span className="text-purple-400 text-[10px] font-bold">LIVE</span>
          </div>

          <div className="h-28 flex items-end justify-between gap-1 pt-2 pb-1">
            {[45, 60, 30, 80, 95, 70, 40, 85, 90, 65, 50, 75, 100, 80, 55, 90, 40, 60].map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 0.6, delay: i * 0.02 }}
                className="flex-1 bg-gradient-to-t from-purple-900 via-purple-600 to-violet-400 rounded-t-sm"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pt-1 border-t border-purple-500/15">
            <span>24h Range</span>
            <span className="text-purple-300 font-bold">+18.5% Spikes</span>
          </div>

          {/* Quick Camera Re-center button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRecenterCamera}
            className="w-full mt-1.5 py-1.5 px-2 rounded-lg bg-[#030305] border border-purple-500/20 text-[10px] font-mono text-purple-300 flex items-center justify-center gap-1.5 hover:bg-purple-950/30 transition-colors"
          >
            <Compass className="w-3 h-3 text-purple-400" />
            <span>Re-Center WebGL Camera</span>
          </motion.button>
        </motion.div>

        {/* Center: Interactive Three.js WebGL Rotating Cyber Wireframe Globe */}
        <div className="lg:col-span-3 relative h-[320px] select-none">
          <WebGLCyberGlobe isRailOpen={isRailOpen || cameraCentered} />
        </div>
      </div>

      {/* AI Prompt Input Bar */}
      <motion.form
        onSubmit={handlePromptSubmit}
        whileHover={{
          borderColor: 'rgba(147, 51, 234, 0.40)',
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.20)'
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center bg-[#030305]/90 border border-purple-500/15 rounded-xl p-1.5 shadow-inner"
      >
        <div className="flex items-center space-x-2 pl-3">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 text-[10px] font-mono border border-purple-500/30">
            <Bot className="w-3 h-3 text-purple-300" />
            <span>{t('soc.myAgent', 'My agent')}</span>
            <span className="text-violet-300 font-bold">+3</span>
          </span>
        </div>

        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder={t(
            'soc.askIntelligence',
            'Ask Threat Intelligence... (e.g. "Summarize active C2 beacons across Asia Pacific")'
          )}
          className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
        />

        <div className="flex items-center space-x-2 pr-1">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0A10] text-[11px] font-mono text-zinc-400 border border-purple-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>{t('soc.aiSecurityAnalyst', 'AI Security Analyst')}</span>
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-2 rounded-lg bg-gradient-to-r from-purple-700/30 to-violet-600/30 hover:from-purple-700/50 hover:to-violet-600/50 text-purple-200 border border-purple-500/30 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.25)]"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.form>

      {/* Bottom KPI Bar & Load Sequence Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-purple-500/15">
        {/* Security Score */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 18px rgba(147, 51, 234, 0.25)',
            borderColor: 'rgba(147, 51, 234, 0.40)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="p-3 rounded-xl bg-[#030305]/80 border border-purple-500/15 cursor-default"
        >
          <div className="text-[10px] font-mono text-zinc-400">{t('soc.securityScore', 'Security Score')}</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white">98%</span>
            <span className="text-[10px] font-mono text-purple-300 font-semibold">+2.7%</span>
          </div>
        </motion.div>

        {/* Threats Blocked */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 18px rgba(147, 51, 234, 0.25)',
            borderColor: 'rgba(147, 51, 234, 0.40)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="p-3 rounded-xl bg-[#030305]/80 border border-purple-500/15 cursor-default"
        >
          <div className="text-[10px] font-mono text-zinc-400">{t('soc.threatsBlocked', 'Threats Blocked')}</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white">14,872</span>
            <span className="text-[10px] font-mono text-purple-300 font-semibold">+32%</span>
          </div>
        </motion.div>

        {/* Protected Devices */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 18px rgba(139, 92, 246, 0.25)',
            borderColor: 'rgba(139, 92, 246, 0.40)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="p-3 rounded-xl bg-[#030305]/80 border border-purple-500/15 cursor-default"
        >
          <div className="text-[10px] font-mono text-zinc-400">{t('soc.protectedDevices', 'Protected Devices')}</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-white">24,389</span>
            <span className="text-[10px] font-mono text-purple-300 font-semibold">+18%</span>
          </div>
        </motion.div>

        {/* Active Incidents */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 18px rgba(244, 63, 94, 0.25)',
            borderColor: 'rgba(244, 63, 94, 0.40)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="p-3 rounded-xl bg-[#030305]/80 border border-purple-500/15 cursor-default"
        >
          <div className="text-[10px] font-mono text-zinc-400">{t('soc.activeIncidents', 'Active Incidents')}</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-purple-300">38</span>
            <span className="text-[10px] font-mono text-rose-400 font-semibold">+312%</span>
          </div>
        </motion.div>

        {/* Load Sequence Timeline Scrubber */}
        <motion.div
          whileHover={{
            scale: 1.01,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.22)',
            borderColor: 'rgba(147, 51, 234, 0.38)'
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="col-span-2 p-3 rounded-xl bg-[#030305]/80 border border-purple-500/15 space-y-2"
        >
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400 uppercase tracking-wider">{t('soc.loadSequence', 'Load Sequence')}</span>
            <div className="flex items-center gap-3">
              <span className="text-purple-300 font-bold">161.35 Alerts</span>
              <span className="text-violet-300 font-bold">96.15 Resolve</span>
            </div>
          </div>

          {/* Interactive Timeline Track */}
          <div
            className="relative h-4 bg-[#080714] rounded-full border border-purple-500/15 cursor-pointer flex items-center px-2"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
              setActiveScrubber(percent);
            }}
          >
            {/* Wave markers */}
            <div className="w-full flex justify-between items-center opacity-40">
              <span className="w-1 h-2 bg-zinc-600 rounded" />
              <span className="w-1 h-2 bg-purple-400 rounded" />
              <span className="w-1 h-3 bg-violet-400 rounded" />
              <span className="w-1 h-2 bg-zinc-600 rounded" />
              <span className="w-1 h-2.5 bg-purple-400 rounded" />
              <span className="w-1 h-2 bg-violet-400 rounded" />
            </div>

            {/* Glowing Scrubber Cursor */}
            <motion.div
              layout
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-violet-300 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
              style={{ left: `${activeScrubber}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>14:16</span>
            <span>14:24</span>
            <span>14:32</span>
            <span>14:36</span>
            <span>14:40</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
