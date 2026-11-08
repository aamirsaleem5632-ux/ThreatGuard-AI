import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

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
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-cyber-cyan/30 selection:text-cyber-cyan">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
