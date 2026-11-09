'use client';

import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-6 font-mono selection:bg-purple-500/30 selection:text-purple-300">
        <div className="max-w-xl w-full bg-[#0B0A10] border border-rose-500/40 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wider uppercase">
                ThreatGuard AI System Protected
              </h1>
              <p className="text-xs text-zinc-400">
                An isolated client-side exception was safely intercepted.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#030305] border border-rose-500/30 space-y-2">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Exception Trace:</div>
            <div className="text-xs text-rose-400 font-semibold break-words">
              {error?.message || 'Client runtime exception encountered.'}
            </div>
            {error?.digest && (
              <div className="text-[10px] text-zinc-500">Digest: {error.digest}</div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 text-xs font-bold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recover System</span>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/command-center';
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#030305] hover:bg-[#0F0E18] text-zinc-400 hover:text-white border border-purple-500/15 text-xs transition-colors"
            >
              Command Center
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
