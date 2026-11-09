'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackTitle?: string;
  name?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[ThreatGuard AI - ErrorBoundary] Caught exception in ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  handleReset = () => {
    try {
      this.props.onReset?.();
    } catch (e) {
      console.warn('[ThreatGuard AI - ErrorBoundary] Error executing onReset handler:', e);
    }
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.href = window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-6 rounded-2xl bg-[#0B0A10] border border-rose-500/40 text-white space-y-4 my-4 font-mono shadow-xl select-none">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {this.props.fallbackTitle || 'Component Recovered Gracefully'}
              </h3>
              <p className="text-xs text-zinc-400">
                An isolated client-side runtime error was safely intercepted without crashing the page.
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="p-3 rounded-lg bg-[#030305] border border-purple-500/15 text-xs text-rose-400 truncate">
              {this.state.error.message || 'Unknown runtime exception'}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#030305] hover:bg-[#0F0E18] text-zinc-400 hover:text-white border border-purple-500/15 text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
