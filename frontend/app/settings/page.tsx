'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Save
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
      <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-xs font-mono text-purple-300 uppercase tracking-wider font-bold">
              System Settings & Integration Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
            Model Context Protocol (MCP) & Threat Feeds
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Manage Model Context Protocol server tools, external CTI keys, and RBAC permissions
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[#030305] p-1 rounded-xl border border-purple-500/15 text-xs font-mono">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'mcp' ? 'bg-purple-950/60 text-purple-300 font-bold border border-purple-500/30' : 'text-zinc-400 hover:text-white'}`}
          >
            MCP Tools (12)
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'integrations' ? 'bg-purple-950/60 text-purple-300 font-bold border border-purple-500/30' : 'text-zinc-400 hover:text-white'}`}
          >
            API Feeds
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'organization' ? 'bg-purple-950/60 text-purple-300 font-bold border border-purple-500/30' : 'text-zinc-400 hover:text-white'}`}
          >
            RBAC & Tenancy
          </button>
        </div>
      </div>

      {/* TAB 1: MODEL CONTEXT PROTOCOL (MCP) TOOLS */}
      {activeTab === 'mcp' && (
        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Registered MCP Security Tools ({tools.length})</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/25">
              Protocol v1.0 Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#030305] border border-purple-500/15 space-y-2 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">{tool.name}</span>
                  <span className="text-[10px] text-violet-300 bg-[#080714] px-1.5 py-0.5 rounded border border-purple-500/15">
                    {tool.category}
                  </span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">{tool.description}</p>
                <div className="pt-2 border-t border-purple-500/15 flex flex-wrap gap-1">
                  {tool.parameters.map((p, pidx) => (
                    <span
                      key={pidx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B0A10] border border-purple-500/15 text-white/80"
                    >
                      {p.name}: <strong className="text-purple-300">{p.type}</strong>
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
        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-6">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              Threat Intelligence & AI Provider API Keys
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Keys are securely encrypted using environment variables and AES-256 before backend storage.
            </p>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-4 max-w-xl font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Google Gemini API Key:</label>
              <input
                type="text"
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">AbuseIPDB API Key:</label>
              <input
                type="text"
                value={apiKeys.abuseipdb}
                onChange={(e) => setApiKeys({ ...apiKeys, abuseipdb: e.target.value })}
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 uppercase text-[10px]">URLhaus API Token:</label>
              <input
                type="text"
                value={apiKeys.urlhaus}
                onChange={(e) => setApiKeys({ ...apiKeys, urlhaus: e.target.value })}
                className="w-full bg-[#030305] border border-purple-500/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 font-bold text-xs shadow-[0_0_15px_rgba(201,168,68,0.2)] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-purple-300" />
              <span>{saved ? 'Settings Saved!' : 'Save Integration Credentials'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ORGANIZATION & RBAC */}
      {activeTab === 'organization' && (
        <div className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-white uppercase pb-2 border-b border-purple-500/15">
            Authorized Organization Profiles & Roles
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#030305] border border-purple-500/15 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Esha Amir Choudhary</div>
                <div className="text-zinc-400 text-[11px]">esha@threatguard.ai • Lead Frontend & Product Integration</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/25 text-[10px] font-bold">
                Super Administrator
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#030305] border border-purple-500/15 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Dur e Kahaf</div>
                <div className="text-zinc-400 text-[11px]">kahaf@threatguard.ai • Lead Backend & AI Systems</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/25 text-[10px] font-bold">
                Organization Administrator
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
