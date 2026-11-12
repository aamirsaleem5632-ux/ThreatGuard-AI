'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Loader2
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Strength Criteria Checklist
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.hasMinLength) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasSpecial) score += 1;
    return score;
  }, [passwordCriteria]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: '', color: 'bg-zinc-700' };
    if (passwordScore <= 2) return { text: 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (passwordScore === 3) return { text: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (passwordScore === 4) return { text: 'Good', color: 'bg-purple-500', width: 'w-3/4' };
    return { text: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  }, [password, passwordScore]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a secure password.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        organizationName: organizationName.trim() || undefined
      });
      setSuccessMessage('Account registered successfully! Initializing your autonomous SOC dashboard...');
      setTimeout(() => {
        router.push('/command-center');
      }, 1000);
    } catch (err: any) {
      const msg = err.message || 'Registration failed. An account with this email may already exist.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Registration Card */}
      <div className="bg-[#080714]/90 border border-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.12)]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#030305] border border-purple-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(147,51,234,0.25)]">
            <ShieldAlert className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">
            Create Customer Account
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Deploy your dedicated autonomous cybersecurity workspace
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Full Name <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Samantha Vance"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Work Email Address <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samantha@cyberguard.internal"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
              />
            </div>
          </div>

          {/* Organization Name (Optional) */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Organization / Company <span className="text-zinc-500 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Cyber Defense Financial Corp"
                className="w-full bg-[#0B0A10] border border-purple-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 font-mono transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Password <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Strength:</span>
                  <span className={`font-semibold ${
                    passwordScore <= 2 ? 'text-rose-400' :
                    passwordScore === 3 ? 'text-amber-400' :
                    passwordScore === 4 ? 'text-purple-400' : 'text-emerald-400'
                  }`}>
                    {strengthLabel.text}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0B0A10] rounded-full overflow-hidden border border-purple-500/20">
                  <div className={`h-full transition-all duration-300 ${strengthLabel.color} ${strengthLabel.width || 'w-0'}`} />
                </div>

                {/* Password Criteria Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center space-x-1">
                    {passwordCriteria.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {passwordCriteria.hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {passwordCriteria.hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {passwordCriteria.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-zinc-600" />}
                    <span>Number (0-9)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Confirm Password <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
            {passwordsMatch === true && (
              <p className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Passwords match</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || passwordsMatch === false}
            className="w-full mt-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-900/60 via-purple-700/40 to-violet-800/60 hover:from-purple-800/70 hover:to-violet-700/70 text-purple-100 border border-purple-500/40 py-2.5 rounded-lg text-xs font-mono font-semibold shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                <span>Deploying Secure Account...</span>
              </>
            ) : (
              <>
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login */}
      <div className="text-center mt-6">
        <p className="text-xs font-mono text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

