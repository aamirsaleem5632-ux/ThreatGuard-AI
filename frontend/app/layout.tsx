import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const metadata: Metadata = {
  title: 'ThreatGuard AI - Autonomous AI Cybersecurity & Threat Intelligence Platform',
  description: 'Enterprise Autonomous Cybersecurity SaaS with 12 specialized domains, domain AI assistants, multi-agent orchestration, and transparent 5-factor risk scoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-purple-500/30 selection:text-purple-300 bg-[#030705] text-white" suppressHydrationWarning>
        <ErrorBoundary name="RootApp">
          <LanguageProvider>
            <AuthProvider>
              {/* Suspense required: AppShell uses usePathname/useRouter hooks */}
              <Suspense fallback={
                <div className="min-h-screen bg-[#030705] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-purple-600/40 border-t-purple-400 rounded-full animate-spin" />
                </div>
              }>
                <AppShell>{children}</AppShell>
              </Suspense>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
