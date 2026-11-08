'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Building2,
  ShieldCheck,
  Zap,
  UserCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickInvestigate?: () => void;
  onToggleAssistant?: () => void;
}

export default function Header({ onOpenQuickInvestigate, onToggleAssistant }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/investigations?target=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="h-16 bg-cyber-deep/90 backdrop-blur border-b border-cyber-card flex items-center justify-between px-6 sticky top-0 z-30 ml-72">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicator (IP, Domain, Hash), CVE-2024-..., or alert ID..."
            className="w-full bg-cyber-card/80 border border-cyber-card rounded-lg pl-10 pr-24 py-2 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan font-mono transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-cyber-cyan/15 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/40 px-2 py-0.5 rounded text-[11px] font-mono transition-colors"
          >
            Investigate
          </button>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Organization Badge */}
        <div className="hidden lg:flex items-center space-x-2 bg-cyber-card border border-cyber-card px-3 py-1.5 rounded-lg text-xs">
          <Building2 className="w-3.5 h-3.5 text-cyber-gold" />
          <span className="text-cyber-white font-medium">Global Defense Financial</span>
          <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.2 rounded border border-cyber-cyan/30">Tier 1</span>
        </div>

        {/* Posture Score Pill */}
        <div className="flex items-center space-x-2 bg-cyber-card border border-cyber-turquoise/30 px-3 py-1.5 rounded-lg text-xs shadow-cyber-cyan">
          <ShieldCheck className="w-4 h-4 text-cyber-turquoise" />
          <span className="text-cyber-muted">Posture:</span>
          <span className="text-cyber-white font-mono font-bold">78.5%</span>
          <span className="w-2 h-2 rounded-full bg-cyber-turquoise animate-pulse"></span>
        </div>

        {/* Run Investigation Action Button */}
        <button
          onClick={onOpenQuickInvestigate}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-cyber-cyan/20 to-cyber-turquoise/20 hover:from-cyber-cyan/30 hover:to-cyber-turquoise/30 text-cyber-cyan border border-cyber-cyan/50 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-cyber-cyan transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-cyber-cyan" />
          <span>New Investigation</span>
        </button>

        {/* AI Assistant Toggle Button */}
        <button
          onClick={onToggleAssistant}
          className="flex items-center space-x-1.5 bg-cyber-card hover:bg-cyber-elevated text-cyber-gold border border-cyber-gold/40 px-3 py-1.5 rounded-lg text-xs font-medium shadow-cyber-gold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-cyber-card border border-cyber-card hover:border-cyber-cyan flex items-center justify-center text-cyber-muted hover:text-cyber-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-critical animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-critical"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-cyber-elevated border border-cyber-card rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-cyber-card mb-3">
                <span className="text-xs font-semibold text-cyber-white uppercase tracking-wider font-mono">SOC Notifications</span>
                <span className="text-[10px] font-mono text-cyber-critical bg-cyber-critical/20 px-1.5 py-0.5 rounded border border-cyber-critical/40">3 Critical</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-cyber-card border-l-2 border-cyber-critical">
                  <div className="font-semibold text-cyber-white">C2 Beaconing Detected</div>
                  <div className="text-cyber-muted text-[11px] mt-0.5">Egress traffic to 185.220.101.5 flagged by AbuseIPDB sensor.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyber-card border-l-2 border-cyber-gold">
                  <div className="font-semibold text-cyber-white">Human Approval Pending</div>
                  <div className="text-cyber-muted text-[11px] mt-0.5">Remediation Agent requests firewall block on malicious-c2-update.org.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyber-card border-l-2 border-cyber-cyan">
                  <div className="font-semibold text-cyber-white">CVE-2024-21413 Monitored</div>
                  <div className="text-cyber-muted text-[11px] mt-0.5">EPSS score 0.785 patch candidate identified.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-cyber-card">
          <div className="w-8 h-8 rounded-lg bg-cyber-card border border-cyber-gold/40 flex items-center justify-center text-cyber-gold font-bold text-xs font-mono">
            EA
          </div>
          <div className="hidden xl:block">
            <div className="text-xs font-medium text-cyber-white">Esha Amir Choudhary</div>
            <div className="text-[10px] text-cyber-muted font-mono">Super Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
