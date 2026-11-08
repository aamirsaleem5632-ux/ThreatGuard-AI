'use client';

import React, { useState } from 'react';
import {
  Send,
  Mail,
  Building,
  User,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-6 lg:px-12 max-w-3xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-cyber-white tracking-tight">
          Request an Enterprise Demo
        </h1>
        <p className="text-sm text-cyber-muted font-mono">
          Connect with the ThreatGuard AI team for tailored multi-agent SOC evaluations.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-cyber-card border border-cyber-card shadow-2xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyber-turquoise/20 border border-cyber-turquoise text-cyber-turquoise mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-cyber-white">Demo Request Received</h3>
            <p className="text-xs text-cyber-muted font-mono max-w-md mx-auto">
              Thank you! Our cybersecurity engineering team will contact you at <span className="text-cyber-cyan">{formData.email}</span> within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Esha Amir Choudhary"
                    className="w-full bg-cyber-deep border border-cyber-card rounded-lg pl-10 pr-4 py-2.5 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="analyst@enterprise.com"
                    className="w-full bg-cyber-deep border border-cyber-card rounded-lg pl-10 pr-4 py-2.5 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase">Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  placeholder="Global Defense Financial Corporation"
                  className="w-full bg-cyber-deep border border-cyber-card rounded-lg pl-10 pr-4 py-2.5 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyber-muted mb-1.5 uppercase">Security Requirements & Notes</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your current SOC scale, SIEM telemetry sources, or evaluation scope..."
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg p-3 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-cyan/30 to-cyber-turquoise/30 hover:from-cyber-cyan/40 hover:to-cyber-turquoise/40 text-cyber-cyan border border-cyber-cyan/60 font-semibold text-xs font-mono shadow-cyber-cyan transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Evaluation Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
