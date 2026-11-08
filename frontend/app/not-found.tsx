'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-deep text-cyber-white flex items-center justify-center p-8 font-mono">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyber-card border border-cyber-cyan/40 flex items-center justify-center shadow-cyber-cyan">
            <ShieldAlert className="w-8 h-8 text-cyber-cyan" />
          </div>
        </div>
        <div>
          <div className="text-6xl font-bold text-cyber-cyan/30 mb-2">404</div>
          <h1 className="text-xl font-bold text-cyber-white">Route Not Found</h1>
          <p className="text-sm text-cyber-muted mt-2 max-w-md">
            The requested security workspace could not be located in the ThreatGuard AI platform.
          </p>
        </div>
        <Link
          href="/command-center"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/50 text-sm font-semibold transition-all"
        >
          <span>Go to Command Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
