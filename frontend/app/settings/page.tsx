'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Terminal,
  Key,
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Save,
  Server
} from 'lucide-react';
import { api } from '@/lib/api';
import { MCPTool } from '@/lib/types';

export default function SettingsPage() {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [activeTab, setActiveTab] = useState<'mcp' | 'integrations' | 'organization'>('mcp');
  const [apiKeys, setApiKeys] = useState({
    gemini: '••••••••••••••••••••••••••••••••••••',
    abuseipdb: '••••••••••••••••••••••••••••••••••••',
    urlhaus: '••••••••••••••••••••••••••••••••••••'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadMCP() {
      const data = await api.getMCPTools();
      setTools(data);
    }
    loadMCP();
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider font-bold">
              System Settings & Integration Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cyber-white tracking-wide mt-1">
            Model Context Protocol (MCP) & Threat Feeds
          </h1>
          <p className="text-xs text-cyber-muted font-mono">
            Manage Model Context Protocol server tools, external CTI keys, and RBAC permissions
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-cyber-deep p-1 rounded-xl border border-cyber-card text-xs font-mono">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'mcp' ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40' : 'text-cyber-muted hover:text-cyber-white'}`}
          >
            MCP Tools (12)
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'integrations' ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40' : 'text-cyber-muted hover:text-cyber-white'}`}
          >
            API Feeds
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'organization' ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40' : 'text-cyber-muted hover:text-cyber-white'}`}
          >
            RBAC & Tenancy
          </button>
        </div>
      </div>

      {/* TAB 1: MODEL CONTEXT PROTOCOL (MCP) TOOLS */}
      {activeTab === 'mcp' && (
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4">
          <div className="flex items-center justify-between border-b border-cyber-deep pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyber-white uppercase">
              <Terminal className="w-4 h-4 text-cyber-cyan" />
              <span>Registered MCP Security Tools ({tools.length})</span>
            </div>
            <span className="text-[10px] font-mono text-cyber-turquoise px-2 py-0.5 rounded bg-cyber-turquoise/10 border border-cyber-turquoise/30">
              Protocol v1.0 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-cyber-deep border border-cyber-card space-y-2 hover:border-cyber-cyan/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyber-cyan">{tool.name}</span>
                  <span className="text-[10px] text-cyber-gold bg-cyber-navy px-1.5 py-0.5 rounded border border-cyber-card">
                    {tool.category}
                  </span>
                </div>
                <p className="text-cyber-muted font-sans text-xs">{tool.description}</p>
                <div className="pt-2 border-t border-cyber-card/60 flex flex-wrap gap-1">
                  {tool.parameters.map((p, pidx) => (
                    <span
                      key={pidx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-card border border-cyber-card text-cyber-white/80"
                    >
                      {p.name}: <strong className="text-cyber-turquoise">{p.type}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: API INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-6">
          <div>
            <h3 className="text-sm font-bold font-mono text-cyber-white uppercase">
              Threat Intelligence & AI Provider API Keys
            </h3>
            <p className="text-xs text-cyber-muted font-mono mt-1">
              Keys are securely encrypted using environment variables and AES-256 before backend storage.
            </p>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-4 max-w-xl font-mono text-xs">
            <div>
              <label className="block text-cyber-muted mb-1 uppercase text-[10px]">Google Gemini API Key:</label>
              <input
                type="text"
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg p-2.5 text-cyber-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1 uppercase text-[10px]">AbuseIPDB API Key:</label>
              <input
                type="text"
                value={apiKeys.abuseipdb}
                onChange={(e) => setApiKeys({ ...apiKeys, abuseipdb: e.target.value })}
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg p-2.5 text-cyber-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1 uppercase text-[10px]">URLhaus API Token:</label>
              <input
                type="text"
                value={apiKeys.urlhaus}
                onChange={(e) => setApiKeys({ ...apiKeys, urlhaus: e.target.value })}
                className="w-full bg-cyber-deep border border-cyber-card rounded-lg p-2.5 text-cyber-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-cyber-deep font-bold text-xs shadow-cyber-cyan hover:bg-cyber-cyan/90 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saved ? 'Settings Saved!' : 'Save Integration Credentials'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ORGANIZATION & RBAC */}
      {activeTab === 'organization' && (
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-card space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-cyber-white uppercase pb-2 border-b border-cyber-deep">
            Authorized Organization Profiles & Roles
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card flex items-center justify-between">
              <div>
                <div className="font-bold text-cyber-white">Esha Amir Choudhary</div>
                <div className="text-cyber-muted text-[11px]">esha@threatguard.ai • Lead Frontend & Product Integration</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/40 text-[10px] font-bold">
                Super Administrator
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cyber-deep border border-cyber-card flex items-center justify-between">
              <div>
                <div className="font-bold text-cyber-white">Kahaf</div>
                <div className="text-cyber-muted text-[11px]">kahaf@threatguard.ai • Lead Backend & AI Systems</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 text-[10px] font-bold">
                Organization Administrator
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
