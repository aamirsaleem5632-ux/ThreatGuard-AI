'use client';

import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-cyber-deep text-cyber-white flex items-center justify-center p-8 font-mono">
      <div className="max-w-2xl w-full bg-cyber-card border border-cyber-critical/40 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-critical/20 border border-cyber-critical/50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-cyber-critical" />
          </div>
          <div>
            <div className="text-sm font-bold text-cyber-critical uppercase tracking-widest">
              Client Runtime Error
            </div>
            <div className="text-[11px] text-cyber-muted">ThreatGuard AI — Diagnostic Mode</div>
          </div>
        </div>

        {/* Error Message */}
        <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-critical/30">
          <div className="text-xs text-cyber-muted uppercase mb-2">Error Message:</div>
          <div className="text-sm text-cyber-critical font-bold break-words">
            {error?.message || 'Unknown client-side error'}
          </div>
          {error?.digest && (
            <div className="text-[11px] text-cyber-muted mt-1">Digest: {error.digest}</div>
          )}
        </div>

        {/* Stack Trace */}
        {error?.stack && (
          <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card overflow-auto max-h-60">
            <div className="text-[10px] text-cyber-muted uppercase mb-2">Stack Trace:</div>
            <pre className="text-[10px] text-cyber-white/70 whitespace-pre-wrap break-words leading-relaxed">
              {error.stack}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan border border-cyber-cyan/50 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
          <a
            href="/command-center"
            className="px-4 py-2 rounded-lg bg-cyber-card hover:bg-cyber-elevated text-cyber-muted hover:text-cyber-white border border-cyber-card text-xs transition-colors"
          >
            Go to Command Center
          </a>
        </div>
      </div>
    </div>
  );
}
