'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-8 font-mono">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0B0A10] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,68,0.25)]">
            <ShieldAlert className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div>
          <div className="text-6xl font-bold text-purple-500/20 mb-2">404</div>
          <h1 className="text-xl font-bold text-white">Route Not Found</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-md">
            The requested security workspace could not be located in the ThreatGuard AI platform.
          </p>
        </div>
        <Link
          href="/command-center"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 text-sm font-semibold shadow-[0_0_15px_rgba(201,168,68,0.2)] transition-all"
        >
          <span>Go to Command Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
