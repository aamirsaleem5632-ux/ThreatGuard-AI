'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8 font-mono text-zinc-400">
        Loading Login Portal...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/command-center';
  const registeredMsg = searchParams.get('registered');

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    registeredMsg ? 'Account created successfully! Please log in with your credentials.' : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      router.push(redirectPath);
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify your email and password.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container Card */}
      <div className="bg-[#080714]/90 border border-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.12)]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(147,51,234,0.25)]">
            <ShieldAlert className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">
            Sign In to ThreatGuard AI
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Access your autonomous security command center
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-start space-x-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Work Email Address
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-zinc-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B0A10] border-purple-500/30 text-purple-600 focus:ring-purple-500/40 focus:ring-offset-0 focus:ring-1 accent-purple-600"
              />
              <span className="text-xs text-zinc-400 font-mono">Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-900/60 via-purple-700/40 to-violet-800/60 hover:from-purple-800/70 hover:to-violet-700/70 text-purple-100 border border-purple-500/40 py-2.5 rounded-lg text-xs font-mono font-semibold shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to SOC Console</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Sign Up */}
      <div className="text-center mt-6">
        <p className="text-xs font-mono text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

