'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Loader2
} from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8 font-mono text-zinc-400">
        Loading Reset Portal...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token') || '';

  const [token, setToken] = useState(urlToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password criteria checklist
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.hasMinLength) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    return score;
  }, [passwordCriteria]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!token.trim()) {
      setErrorMessage('Please provide a valid password reset token.');
      return;
    }
    if (!newPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword({
        token: token.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setSuccessMessage(res.message || 'Password successfully updated! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The token may be expired or invalid.');
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
            Set New Password
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Create a new strong password for your ThreatGuard AI account
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
          {/* Recovery Token Field */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Reset Token <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste recovery token"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              New Password <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 chars (mixed case, digit)"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
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

            {/* Checklist */}
            {newPassword && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1.5 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center space-x-1">
                  {passwordCriteria.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                  <span>8+ characters</span>
                </div>
                <div className="flex items-center space-x-1">
                  {passwordCriteria.hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                  <span>Uppercase</span>
                </div>
                <div className="flex items-center space-x-1">
                  {passwordCriteria.hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                  <span>Lowercase</span>
                </div>
                <div className="flex items-center space-x-1">
                  {passwordCriteria.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                  <span>Number (0-9)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Confirm New Password <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={`w-full bg-[#0B0A10] border rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 font-mono transition-all ${
                  passwordsMatch === false
                    ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                    : passwordsMatch === true
                    ? 'border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/40'
                    : 'border-purple-500/20 focus:border-purple-500/60 focus:ring-purple-500/40'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordsMatch === false && (
              <p className="text-[10px] font-mono text-rose-400 mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || passwordsMatch === false}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-900/60 via-purple-700/40 to-violet-800/60 hover:from-purple-800/70 hover:to-violet-700/70 text-purple-100 border border-purple-500/40 py-2.5 rounded-lg text-xs font-mono font-semibold shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs font-mono text-zinc-400">
          Already updated?{' '}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Sign In with New Password
          </Link>
        </p>
      </div>
    </div>
  );
}

