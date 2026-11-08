'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  X,
  ShieldAlert,
  ArrowRight,
  Database,
  Radio,
  FileCode,
  Sparkles
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

export default function QuickInvestigationModal({ isOpen, onClose }: QuickInvestigationModalProps) {
  const router = useRouter();
  const [indicator, setIndicator] = useState('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-cyber-deep/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-cyber-elevated border border-cyber-card rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-cyber-muted hover:text-cyber-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyber-card border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-cyber-cyan">
            <Zap className="w-5 h-5 fill-cyber-cyan" />
          </div>
          <div>
            <h3 className="text-base font-bold text-cyber-white tracking-wide">
              Launch Autonomous AI Investigation
            </h3>
            <p className="text-xs text-cyber-muted font-mono">
              Multi-Agent Orchestration & Transparent 5-Factor Risk Scoring
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase">
              Target Indicator (IP, Domain, URL, or File Hash)
            </label>
            <div className="relative">
              <input
                type="text"
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                placeholder="e.g. malicious-c2-update.org or 185.220.101.5"
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg px-4 py-2.5 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-cyber-muted flex items-center justify-between">
              <span>Or Select Verified Threat Vector:</span>
              <span className="text-cyber-cyan text-[10px]">Instant Demo</span>
            </div>
            <div className="space-y-1.5">
              {SAMPLE_INDICATORS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.label)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-cyber-deep/80 hover:bg-cyber-card border border-cyber-card text-left transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-navy border border-cyber-card text-cyber-cyan">
                      {sample.type}
                    </span>
                    <span className="text-xs font-mono text-cyber-white truncate group-hover:text-cyber-cyan transition-colors">
                      {sample.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-cyber-muted font-mono flex items-center gap-1 group-hover:text-cyber-white">
                    <span>{sample.desc}</span>
                    <ArrowRight className="w-3 h-3 text-cyber-cyan" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-cyber-muted hover:text-cyber-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!indicator.trim()}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan/30 to-cyber-turquoise/30 hover:from-cyber-cyan/40 hover:to-cyber-turquoise/40 text-cyber-cyan border border-cyber-cyan/50 text-xs font-semibold shadow-cyber-cyan disabled:opacity-40 transition-all font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Autonomous Triage</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
