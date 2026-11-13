'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Notification } from '@/lib/types';
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
  Settings as SettingsIcon,
  Award
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenQuickInvestigate?: () => void;
  onToggleAssistant?: () => void;
}

export default function Header({ onToggleSidebar, onOpenQuickInvestigate, onToggleAssistant }: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="h-16 w-full min-w-0 bg-[#030305]/90 border-b border-purple-500/15" />
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
  const userId = user?.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationError, setNotificationError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    let active = true;
    let requestInProgress = false;
    let lastEventId: string | undefined;
    let retryDelay = 1000;
    let retryTimeout: number | undefined;
    let streamController: AbortController | undefined;
    const refreshNotifications = async () => {
      if (requestInProgress || document.visibilityState === 'hidden') return;
      requestInProgress = true;
      try {
        const latest = await api.getNotifications();
        if (active) {
          setNotifications(latest);
          setNotificationError(false);
        }
      } catch (error) {
        if (active) {
          setNotificationError(true);
          console.error('Unable to refresh SOC notifications:', error);
        }
      } finally {
        requestInProgress = false;
      }
    };

    const connectToAlertStream = async () => {
      if (!active) return;
      const controller = new AbortController();
      streamController = controller;
      try {
        await api.streamAlertNotifications({
          lastEventId,
          signal: controller.signal,
          onOpen: () => {
            retryDelay = 1000;
            if (active) setNotificationError(false);
          },
          onEvent: eventId => {
            if (eventId) lastEventId = eventId;
            void refreshNotifications();
          },
        });
      } catch (error) {
        if (active && !controller.signal.aborted) {
          setNotificationError(true);
          console.error('SOC notification stream disconnected; reconnecting:', error);
        }
      } finally {
        if (active && !controller.signal.aborted) {
          retryTimeout = window.setTimeout(() => {
            void connectToAlertStream();
          }, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30000);
        }
      }
    };

    void refreshNotifications();
    void connectToAlertStream();
    const intervalId = window.setInterval(refreshNotifications, 15000);
    document.addEventListener('visibilitychange', refreshNotifications);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      if (retryTimeout !== undefined) window.clearTimeout(retryTimeout);
      streamController?.abort();
      document.removeEventListener('visibilitychange', refreshNotifications);
    };
  }, [userId]);

  const unreadNotifications = notifications.filter(notification => !notification.is_read);

  const markNotificationRead = async (alertId: string) => {
    try {
      await api.markNotificationRead(alertId);
      setNotifications(current => current.map(notification =>
        notification.id === alertId ? { ...notification, is_read: true } : notification
      ));
    } catch (error) {
      console.error('Unable to mark SOC notification as read:', error);
    }
  };

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
    <header className="relative min-h-16 w-full min-w-0 max-w-full bg-[#030305]/90 backdrop-blur-xl border-b border-purple-500/15 flex items-center gap-2 px-3 sm:px-6 sticky top-0 z-30 select-none">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open navigation menu"
        className="lg:hidden shrink-0 rounded-lg border border-purple-500/20 bg-[#0B0A10] p-2 text-purple-300 hover:bg-[#0F0E18]"
      >
        <Menu className="w-5 h-5" />
      </button>
      <form onSubmit={handleSearchSubmit} className="w-40 sm:w-52 lg:w-52 xl:w-56 2xl:w-80 min-w-0 shrink-0">
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

      <div className="flex-1 min-w-0" />
      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {/* Organization Tier Badge */}
        <div className="hidden xl:flex shrink-0 items-center gap-1.5 bg-[#0B0A10] border border-purple-500/15 px-2 py-1.5 rounded-lg text-xs">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-purple-400" />
          <span className="max-w-[80px] 2xl:max-w-[144px] truncate text-white font-medium" title={displayOrg}>{displayOrg}</span>
          <span className="whitespace-nowrap shrink-0 text-[10px] font-mono text-purple-300 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-500/30">
            {t('header.tier1', 'Tier 1 Enterprise')}
          </span>
        </div>

        {/* Run Investigation Action Button */}
        <button
          onClick={onOpenQuickInvestigate}
          type="button"
          aria-label={t('header.newInvestigation', 'New Investigation')}
          title={t('header.newInvestigation', 'New Investigation')}
          className="hidden lg:flex shrink-0 items-center space-x-1.5 bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all pointer-events-auto"
        >
          <Zap className="w-3.5 h-3.5 fill-purple-500 text-purple-400" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t('header.newInvestigation', 'New Investigation')}</span>
        </button>

        {/* Posture Score Pill */}
        <div className="hidden 2xl:flex shrink-0 items-center space-x-2 bg-[#0B0A10] border border-purple-500/20 px-3 py-1.5 rounded-lg text-xs shadow-[0_0_15px_rgba(147,51,234,0.15)]">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-400">{t('header.posture', 'Posture')}:</span>
          <span className="text-white font-mono font-bold">78.5%</span>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
        </div>

        {/* AI Assistant Toggle Button */}
        <button
          onClick={onToggleAssistant}
          type="button"
          aria-label={t('header.aiCopilot', 'AI Copilot')}
          className="flex shrink-0 items-center space-x-1.5 bg-[#0B0A10] hover:bg-[#0F0E18] text-purple-300 border border-purple-500/30 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">{t('header.aiCopilot', 'AI Copilot')}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`SOC Notifications${unreadNotifications.length ? `, ${unreadNotifications.length} unread` : ''}`}
            className="w-9 h-9 rounded-lg bg-[#0B0A10] border border-purple-500/15 hover:border-purple-500/40 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0F0E18] border border-purple-500/20 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/15 mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  {t('header.notifications', 'SOC Notifications')}
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-500/40">
                  {unreadNotifications.length} Unread
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {notificationError && (
                  <div className="text-[11px] text-rose-400">Unable to connect. Retrying automatically.</div>
                )}
                {notifications.length === 0 && !notificationError && (
                  <div className="text-[11px] text-zinc-400">No security alerts.</div>
                )}
                {notifications.map(notification => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void markNotificationRead(notification.id)}
                    className={`w-full text-left p-2.5 rounded-lg border-l-2 ${
                      notification.severity === 'Critical'
                        ? 'border-rose-500'
                        : notification.severity === 'High'
                          ? 'border-amber-500'
                          : 'border-purple-500'
                    } ${notification.is_read ? 'bg-transparent opacity-70' : 'bg-[#0B0A10]'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-white">{notification.title}</div>
                      {!notification.is_read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                    </div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">{notification.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOP-RIGHT LANGUAGE SELECTOR WIDGET */}
        <div className="hidden sm:block"><LanguageSelector /></div>

        {/* User Profile with Dropdown */}
        <div className="relative shrink-0 pl-1.5 sm:pl-2 border-l border-purple-500/15">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User account menu"
            className="flex min-w-0 items-center space-x-2 p-1 rounded-lg hover:bg-[#0B0A10] transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0B0A10] border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs font-mono shadow-[0_0_12px_rgba(147,51,234,0.2)] group-hover:border-purple-500/60 transition-colors">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <div className="whitespace-nowrap text-xs font-medium text-white">{displayName}</div>
              <div className="hidden 2xl:block text-[10px] text-zinc-400 font-mono truncate max-w-[160px]">{displayRole}</div>
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
                  href="/gamification"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-[#0B0A10] transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Analyst Progress</span>
                </Link>

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
