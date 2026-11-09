'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  X,
  ArrowRight
} from 'lucide-react';

interface QuickInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_INDICATORS = [
  { label: 'malicious-c2-update.org', type: 'Domain', desc: 'Active C2 Beaconing' },
  { label: '185.220.101.5', type: 'IP', desc: 'AbuseIPDB Flagged' },
  { label: 'evil-invoice-phish.net', type: 'Domain', desc: 'Phishing Campaign' },
  { label: 'CVE-2024-21413', type: 'CVE', desc: 'Moniker Link RCE' },
  { label: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'Hash', desc: 'Malware SHA-256' },
];

export default function QuickInvestigationModal(props: QuickInvestigationModalProps) {
  if (!props.isOpen) return null;
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#030305]/80 backdrop-blur-md z-50 flex items-center justify-center font-mono text-zinc-400">
        Loading...
      </div>
    }>
      <QuickInvestigationModalInner {...props} />
    </Suspense>
  );
}

function QuickInvestigationModalInner({ isOpen, onClose }: QuickInvestigationModalProps) {
  const router = useRouter();
  const [indicator, setIndicator] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indicator.trim()) return;
    onClose();
    router.push(`/investigations?target=${encodeURIComponent(indicator.trim())}`);
  };

  const handleSelectSample = (sample: string) => {
    onClose();
    router.push(`/investigations?target=${encodeURIComponent(sample)}`);
  };

  return (
    <div className="fixed inset-0 bg-[#030305]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0B0A10] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.25)]">
            <Zap className="w-5 h-5 fill-purple-500 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Launch Autonomous AI Investigation
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Multi-Agent Orchestration & Transparent 5-Factor Risk Scoring
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
              Target Indicator (IP, Domain, URL, or File Hash)
            </label>
            <div className="relative">
              <input
                type="text"
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                placeholder="e.g. malicious-c2-update.org or 185.220.101.5"
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Or Select Verified Threat Vector:</span>
              <span className="text-purple-300 text-[10px]">Instant Demo</span>
            </div>
            <div className="space-y-1.5">
              {SAMPLE_INDICATORS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.label)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#030305]/80 hover:bg-[#0F0E18] border border-purple-500/15 text-left transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                      {sample.label}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {sample.desc}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {sample.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-purple-500/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!indicator.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 disabled:opacity-40 text-purple-200 border border-purple-500/30 text-xs font-mono font-bold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all"
            >
              <span>Dispatch Agents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
