'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AIAssistantDrawer from '@/components/assistant/AIAssistantDrawer';
import QuickInvestigationModal from '@/components/investigation/QuickInvestigationModal';
import {
  ShieldAlert,
  ArrowRight,
  Terminal,
  ExternalLink,
  Bot
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isQuickInvestigateOpen, setIsQuickInvestigateOpen] = useState(false);

  const isMarketing = MARKETING_ROUTES.includes(pathname);

  if (isMarketing) {
    return (
      <div className="min-h-screen bg-cyber-deep text-cyber-white cyber-grid-pattern flex flex-col">
        {/* Public Marketing Header */}
        <header className="h-20 border-b border-cyber-card/80 bg-cyber-deep/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-navy border border-cyber-cyan/50 flex items-center justify-center shadow-cyber-cyan">
              <ShieldAlert className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <span className="font-bold text-lg text-cyber-white tracking-wider flex items-center gap-1.5">
                THREATGUARD <span className="text-cyber-cyan text-xs font-mono bg-cyber-cyan/15 px-1.5 py-0.5 rounded border border-cyber-cyan/30">AI</span>
              </span>
              <p className="text-[11px] text-cyber-muted font-mono">Autonomous Threat Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono">
            <Link href="/" className={`hover:text-cyber-cyan transition-colors ${pathname === '/' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              Home
            </Link>
            <Link href="/platform" className={`hover:text-cyber-cyan transition-colors ${pathname === '/platform' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              Platform Overview
            </Link>
            <Link href="/solutions" className={`hover:text-cyber-cyan transition-colors ${pathname === '/solutions' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              12 Solutions
            </Link>
            <Link href="/ai-security" className={`hover:text-cyber-cyan transition-colors ${pathname === '/ai-security' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              Agentic AI & MCP
            </Link>
            <Link href="/threat-intel" className={`hover:text-cyber-cyan transition-colors ${pathname === '/threat-intel' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              Threat Intel
            </Link>
            <Link href="/architecture" className={`hover:text-cyber-cyan transition-colors ${pathname === '/architecture' ? 'text-cyber-cyan font-bold' : 'text-cyber-muted'}`}>
              Architecture
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link
              href="/contact"
              className="hidden sm:inline-block px-4 py-2 rounded-lg text-xs font-mono text-cyber-white/80 hover:text-cyber-cyan transition-colors"
            >
              Request Demo
            </Link>
            <Link
              href="/command-center"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan/25 to-cyber-turquoise/25 hover:from-cyber-cyan/35 hover:to-cyber-turquoise/35 text-cyber-cyan border border-cyber-cyan/50 text-xs font-mono font-semibold shadow-cyber-cyan transition-all"
            >
              <span>Launch SOC Command</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Marketing Page Content */}
        <main className="flex-1">{children}</main>

        {/* Public Marketing Footer */}
        <footer className="border-t border-cyber-card bg-cyber-navy/50 py-12 px-6 lg:px-12 text-xs font-mono text-cyber-muted">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-cyber-cyan" />
              <span>ThreatGuard AI © 2026. Built by Esha Amir Choudhary & Kahaf.</span>
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <Link href="/platform" className="hover:text-cyber-cyan">Architecture</Link>
              <Link href="/solutions" className="hover:text-cyber-cyan">12 Domains</Link>
              <Link href="/ai-security" className="hover:text-cyber-cyan">Multi-Agent SOAR</Link>
              <Link href="/command-center" className="text-cyber-cyan font-bold">SOC Dashboard</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated SOC Dashboard Experience
  return (
    <div className="min-h-screen bg-cyber-deep text-cyber-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenQuickInvestigate={() => setIsQuickInvestigateOpen(true)}
          onToggleAssistant={() => setIsAssistantOpen(prev => !prev)}
        />
        <main className="flex-1 p-6 ml-72 overflow-x-hidden">{children}</main>
      </div>

      {/* Floating AI Assistant Trigger Pill */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-4 py-2.5 rounded-full bg-cyber-elevated/90 hover:bg-cyber-card border border-cyber-gold/50 text-cyber-gold shadow-cyber-gold text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
      >
        <Bot className="w-4 h-4 text-cyber-gold" />
        <span>Ask Domain Copilot</span>
      </button>

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
