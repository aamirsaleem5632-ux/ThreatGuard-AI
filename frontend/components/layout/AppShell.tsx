'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AIAssistantDrawer from '@/components/assistant/AIAssistantDrawer';
import QuickInvestigationModal from '@/components/investigation/QuickInvestigationModal';
import ThreatIntelSidebar from '@/components/dashboard/ThreatIntelSidebar';
import LanguageSelector from '@/components/layout/LanguageSelector';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  ArrowRight,
  Bot,
  Radar,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const MARKETING_ROUTES = [
  '/',
  '/platform',
  '/solutions',
  '/ai-security',
  '/threat-intel',
  '/architecture',
  '/contact'
];

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password'
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030305] flex items-center justify-center font-mono text-zinc-400">
        Loading...
      </div>
    }>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isQuickInvestigateOpen, setIsQuickInvestigateOpen] = useState(false);
  const [showIntelRail, setShowIntelRail] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMarketing = MARKETING_ROUTES.some(
    (route) =>
      route === '/'
        ? pathname === route
        : pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthPage && isAuthenticated) {
        router.replace('/command-center');
      } else if (!isMarketing && !isAuthPage && !isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isLoading, isAuthenticated, isAuthPage, isMarketing, pathname, router]);

  const handleToggleIntelRail = () => {
    const next = !showIntelRail;
    setShowIntelRail(next);
    // Trigger smooth WebGL Threat Globe camera re-center transition
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('threatguard:toggle-radar-rail', { detail: { open: next } })
      );
    }
  };

  // Dedicated Authentication Pages Layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#030305] text-white cyber-grid-pattern flex flex-col justify-between">
        {/* Auth Navbar */}
        <header className="h-16 border-b border-purple-500/15 bg-[#030305]/85 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#080714] border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.25)] group-hover:border-purple-500/50 transition-colors">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wider flex items-center gap-1.5 font-sans">
                THREATGUARD <span className="text-purple-300 text-[10px] font-mono bg-purple-950/60 px-1 py-0.5 rounded border border-purple-500/30">AI</span>
              </span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-400 hover:text-purple-300 transition-colors"
            >
              ← Back to Overview
            </Link>
            <LanguageSelector />
          </div>
        </header>

        {/* Auth Content */}
        <main className="flex-1 flex items-center justify-center py-10 px-4">
          <ErrorBoundary name="AuthPageContent">
            {children}
          </ErrorBoundary>
        </main>

        {/* Auth Footer */}
        <footer className="border-t border-purple-500/15 bg-[#08130B]/70 py-4 px-6 text-center text-xs font-mono text-zinc-500">
          <span>ThreatGuard AI Enterprise Security • Autonomous SOC & Threat Intelligence</span>
        </footer>
      </div>
    );
  }

  if (isMarketing) {
    return (
      <div className="min-h-screen bg-[#030705] text-white cyber-grid-pattern flex flex-col">
        {/* Public Marketing Header with Obsidian Purple theme + Language Selector */}
        <header className="h-20 border-b border-purple-500/15 bg-[#030705]/85 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#08130B] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(104,166,109,0.25)] group-hover:border-purple-500/50 transition-colors">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wider flex items-center gap-1.5">
                THREATGUARD <span className="text-purple-300 text-xs font-mono bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">AI</span>
              </span>
              <p className="text-[11px] text-zinc-400 font-mono">Autonomous Threat Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono">
            <Link href="/" className={`hover:text-purple-300 transition-colors ${pathname === '/' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.home', 'Home')}
            </Link>
            <Link href="/platform" className={`hover:text-purple-300 transition-colors ${pathname === '/platform' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.platform', 'Platform Overview')}
            </Link>
            <Link href="/solutions" className={`hover:text-purple-300 transition-colors ${pathname === '/solutions' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.solutions', '12 Domains')}
            </Link>
            <Link href="/ai-security" className={`hover:text-purple-300 transition-colors ${pathname === '/ai-security' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.aiSecurity', 'Agentic AI & MCP')}
            </Link>
            <Link href="/threat-intel" className={`hover:text-purple-300 transition-colors ${pathname === '/threat-intel' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.threatIntel', 'Threat Intel')}
            </Link>
            <Link href="/architecture" className={`hover:text-purple-300 transition-colors ${pathname === '/architecture' ? 'text-purple-300 font-bold' : 'text-zinc-400'}`}>
              {t('nav.architecture', 'Architecture')}
            </Link>
          </nav>

          {/* Action CTAs + Top-Right Language Selector */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/command-center"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="max-w-[120px] truncate">{user?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hidden md:inline-block px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-purple-300 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 rounded-lg text-xs font-mono text-zinc-300 hover:text-purple-300 transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/command-center"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all"
              >
                <span className="whitespace-nowrap">{t('nav.commandCenter', 'Launch SOC Command')}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </motion.div>

            {/* Top-Right Language Selector */}
            <LanguageSelector />
          </div>
        </header>

        {/* Marketing Page Content */}
        <main className="flex-1">
          <ErrorBoundary name="MarketingContent">
            <Suspense fallback={
              <div className="min-h-[50vh] flex items-center justify-center font-mono text-zinc-400">
                Loading...
              </div>
            }>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Public Marketing Footer */}
        <footer className="border-t border-purple-500/15 bg-[#080714]/70 py-12 px-6 lg:px-12 text-xs font-mono text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <span>ThreatGuard AI © 2026. Built by Esha Amir Choudhary & Dur e Kahaf.</span>
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <Link href="/platform" className="hover:text-purple-300">Architecture</Link>
              <Link href="/solutions" className="hover:text-purple-300">12 Domains</Link>
              <Link href="/ai-security" className="hover:text-purple-300">Multi-Agent SOAR</Link>
              <Link href="/command-center" className="text-purple-300 font-bold">SOC Dashboard</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Protected SOC Dashboard Route Guard: Show security validation loader while checking session
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center font-mono text-xs text-zinc-400 gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#080714] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.25)]">
          <ShieldAlert className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>Verifying SOC Security Credentials...</span>
        </div>
      </div>
    );
  }

  // Authenticated SOC Dashboard Experience with Graphical Sidebar Support
  return (
    <div className="min-h-screen bg-[#030305] text-white flex">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <Header
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          onOpenQuickInvestigate={() => setIsQuickInvestigateOpen(true)}
          onToggleAssistant={() => setIsAssistantOpen((prev) => !prev)}
        />

        <div className="flex-1 flex min-w-0">
          <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden">
            <ErrorBoundary name="DashboardContent">
              <Suspense fallback={
                <div className="min-h-[50vh] flex items-center justify-center font-mono text-zinc-400">
                  Loading...
                </div>
              }>
                {children}
              </Suspense>
            </ErrorBoundary>
          </main>

          {/* Graphical Statistics Presentation Sidebar (Optional toggleable rail) */}
          {showIntelRail && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="hidden xl:block h-[calc(100vh-4rem)] sticky top-16 z-20"
            >
              <ThreatIntelSidebar
                isCollapsible
                onManualRefresh={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                      new CustomEvent('threatguard:toggle-radar-rail', { detail: { open: true } })
                    );
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Buttons: Threat Telemetry Rail & AI Copilot */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        {/* Toggle Graphical Telemetry Rail (Hooks up WebGL camera transition) */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 22px rgba(147, 51, 234, 0.40)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleIntelRail}
          title="Toggle Graphical Threat Radar Rail"
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all shadow-lg ${
            showIntelRail
              ? 'bg-purple-950/60 border-purple-500/50 text-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
              : 'bg-[#0F0E18]/90 border-purple-500/20 text-zinc-400 hover:text-purple-300 hover:border-purple-500/40'
          }`}
        >
          <Radar className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <span className="hidden sm:inline font-mono">
            {showIntelRail ? 'Hide Radar Rail' : 'Threat Radar Rail'}
          </span>
        </motion.button>

        {/* AI Assistant Trigger Pill */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(147, 51, 234, 0.45)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#0F0E18]/90 hover:bg-[#0B0A10] border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.25)] text-xs font-semibold backdrop-blur-md transition-all"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Ask Domain Copilot</span>
        </motion.button>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Quick Investigation Modal */}
      <QuickInvestigationModal
        isOpen={isQuickInvestigateOpen}
        onClose={() => setIsQuickInvestigateOpen(false)}
      />
    </div>
  );
}
