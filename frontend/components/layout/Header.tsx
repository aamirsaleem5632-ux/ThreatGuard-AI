'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from '@/components/layout/LanguageSelector';
import {
  Search,
  Menu,
  Bell,
  Building2,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Shield
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenQuickInvestigate?: () => void;
  onToggleAssistant?: () => void;
}

export default function Header({ onToggleSidebar, onOpenQuickInvestigate, onToggleAssistant }: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="h-16 bg-[#030305]/90 border-b border-purple-500/15 lg:ml-72" />
    }>
      <HeaderInner
        onToggleSidebar={onToggleSidebar}
        onOpenQuickInvestigate={onOpenQuickInvestigate}
        onToggleAssistant={onToggleAssistant}
      />
    </Suspense>
  );
}

function HeaderInner({ onToggleSidebar, onOpenQuickInvestigate, onToggleAssistant }: HeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeFilterTeam, setActiveFilterTeam] = useState('Global SOC');
  const [activeFilterRegion, setActiveFilterRegion] = useState('Asia Pacific');

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'EA';

  const displayName = user?.full_name || 'Esha Amir Choudhary';
  const displayRole = user?.role || t('header.superAdmin', 'Super Administrator');
  const displayOrg = user?.organization_name || 'Global Defense';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/investigations?target=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <header className="min-h-16 bg-[#030305]/90 backdrop-blur-xl border-b border-purple-500/15 flex items-center justify-between gap-3 px-3 sm:px-6 sticky top-0 z-30 lg:ml-72 select-none">
      {/* Left side: SOC Quick Filters & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-2xl">
        <button type="button" onClick={onToggleSidebar} aria-label="Open navigation menu" className="lg:hidden shrink-0 rounded-lg border border-purple-500/20 bg-[#0B0A10] p-2 text-purple-300 hover:bg-[#0F0E18]"><Menu className="w-5 h-5" /></button>
        {/* SOC Filter Chips */}
        <div className="hidden 2xl:flex items-center space-x-2 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B0A10] border border-purple-500/15 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <span className="text-purple-300 font-semibold">Team:</span>
            <span>{activeFilterTeam}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B0A10] border border-purple-500/15 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <span className="text-violet-300 font-semibold">Region:</span>
            <span>{activeFilterRegion}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('header.searchPlaceholder', 'Search indicator (IP, Domain, Hash), CVE-2024-..., or alert ID...')}
              className="w-full min-w-0 bg-[#0B0A10] border border-purple-500/15 rounded-lg pl-10 pr-3 sm:pr-24 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
            />
            <button
              type="submit"
              className="hidden sm:block absolute right-1.5 top-1/2 -translate-y-1/2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded text-[11px] font-mono transition-colors"
            >
              {t('header.investigate', 'Investigate')}
            </button>
          </div>
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5 pl-1 sm:pl-4 shrink-0">
        {/* Organization Tier Badge */}
        <div className="hidden xl:flex items-center space-x-2 bg-[#0B0A10] border border-purple-500/15 px-3 py-1.5 rounded-lg text-xs">
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-white font-medium truncate max-w-[140px]">{displayOrg}</span>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 px-1.5 py-0.2 rounded border border-purple-500/30">
            {t('header.tier1', 'Tier 1')}
          </span>
        </div>

        {/* Posture Score Pill */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#0B0A10] border border-purple-500/20 px-3 py-1.5 rounded-lg text-xs shadow-[0_0_15px_rgba(147,51,234,0.15)]">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-400 hidden sm:inline">{t('header.posture', 'Posture')}:</span>
          <span className="text-white font-mono font-bold">78.5%</span>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
        </div>

        {/* Run Investigation Action Button */}
        <button
          onClick={onOpenQuickInvestigate}
          className="hidden xl:flex items-center space-x-1.5 bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-purple-500 text-purple-400" />
          <span>{t('header.newInvestigation', 'New Investigation')}</span>
        </button>

        {/* AI Assistant Toggle Button */}
        <button
          onClick={onToggleAssistant}
          className="flex items-center space-x-1.5 bg-[#0B0A10] hover:bg-[#0F0E18] text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-medium shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">{t('header.aiCopilot', 'AI Copilot')}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="SOC Notifications"
            className="w-9 h-9 rounded-lg bg-[#0B0A10] border border-purple-500/15 hover:border-purple-500/40 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0F0E18] border border-purple-500/20 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/15 mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  {t('header.notifications', 'SOC Notifications')}
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-500/40">
                  3 {t('header.criticalAlerts', 'Critical')}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0B0A10] border-l-2 border-rose-500">
                  <div className="font-semibold text-white">C2 Beaconing Detected</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">Egress traffic to 185.220.101.5 flagged by AbuseIPDB sensor.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0A10] border-l-2 border-purple-600">
                  <div className="font-semibold text-white">Human Approval Pending</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">Remediation Agent requests firewall block on malicious-c2-update.org.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B0A10] border-l-2 border-violet-500">
                  <div className="font-semibold text-white">CVE-2024-21413 Monitored</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">EPSS score 0.785 patch candidate identified.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOP-RIGHT LANGUAGE SELECTOR WIDGET */}
        <div className="hidden sm:block"><LanguageSelector /></div>

        {/* User Profile with Dropdown */}
        <div className="relative pl-2 border-l border-purple-500/15">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User account menu"
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-[#0B0A10] transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0B0A10] border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs font-mono shadow-[0_0_12px_rgba(147,51,234,0.2)] group-hover:border-purple-500/60 transition-colors">
              {initials}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-medium text-white max-w-[130px] truncate">{displayName}</div>
              <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[130px]">{displayRole}</div>
            </div>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${showUserMenu ? 'rotate-180 text-purple-400' : ''}`} />
          </button>

          {/* User Account Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0F0E18] border border-purple-500/20 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="pb-3 border-b border-purple-500/15 mb-2">
                <div className="text-xs font-semibold text-white truncate">{displayName}</div>
                <div className="text-[11px] text-zinc-400 font-mono truncate mt-0.5">{user?.email || 'admin@threatguard.ai'}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {displayOrg}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-[#0B0A10] transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Security & Account Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
