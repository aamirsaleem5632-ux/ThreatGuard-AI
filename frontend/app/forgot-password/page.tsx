'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    setResetToken(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered work email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.forgotPassword(email.trim());
      setStatusMessage(res.message);
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process password reset request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#080714]/90 border border-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.12)]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(147,51,234,0.25)]">
            <KeyRound className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">
            Recover Account Password
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Generate a secure, time-limited recovery link for your account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && !resetToken && (
          <div className="mb-4 p-3 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-start space-x-2.5 text-xs text-purple-200">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Generated Token Banner (Shown when SMTP not configured, adhering to prompt instructions) */}
        {resetToken && (
          <div className="mb-5 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3">
            <div className="flex items-start space-x-2 text-xs text-purple-300 font-mono font-semibold">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Password Recovery Token Generated</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">
              SMTP email delivery is not configured on this host. The single-use reset token has been verified and logged:
            </p>
            <div className="bg-[#030305] p-2.5 rounded-lg border border-purple-500/30 text-[11px] font-mono text-purple-200 break-all select-all">
              {resetToken}
            </div>
            <Link
              href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-800 to-violet-700 hover:from-purple-700 hover:to-violet-600 text-white py-2 rounded-lg text-xs font-mono font-semibold shadow transition-all"
            >
              <span>Continue to Set New Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Request Form */}
        {!resetToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Registered Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise-corp.com"
                  className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-900/60 via-purple-700/40 to-violet-800/60 hover:from-purple-800/70 hover:to-violet-700/70 text-purple-100 border border-purple-500/40 py-2.5 rounded-lg text-xs font-mono font-semibold shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  <span>Generating Recovery Token...</span>
                </>
              ) : (
                <>
                  <span>Request Password Reset</span>
                  <ArrowRight className="w-4 h-4 text-purple-300" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Documentation notice */}
        <div className="mt-5 pt-3 border-t border-purple-500/15 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Token Lifetime: 15 Minutes</span>
          <span>Single-Use Cryptographic Hash</span>
        </div>
      </div>

      {/* Return to Login */}
      <div className="text-center mt-6">
        <p className="text-xs font-mono text-zinc-400">
          Remembered your password?{' '}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

