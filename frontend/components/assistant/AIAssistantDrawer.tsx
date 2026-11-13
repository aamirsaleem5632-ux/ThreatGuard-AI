'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Terminal
} from 'lucide-react';
import { api } from '@/lib/api';

const ASSISTANT_OPTIONS = [
  { id: 'threat-intelligence', name: 'Threat Intelligence Copilot', domain: 'CTI & Attribution' },
  { id: 'soc', name: 'SOC Alert Triage Copilot', domain: 'SIEM & MTTD' },
  { id: 'vulnerabilities', name: 'Vulnerability Copilot', domain: 'CVE & EPSS' },
  { id: 'application-security', name: 'AppSec & API Copilot', domain: 'OWASP & SAST' },
  { id: 'cloud-security', name: 'Cloud Security Copilot', domain: 'CSPM & IAM' },
  { id: 'identity-security', name: 'Identity & ITDR Copilot', domain: 'UEBA & MFA' },
  { id: 'phishing', name: 'Phishing & Fraud Copilot', domain: 'Deception & DMARC' },
  { id: 'endpoint-security', name: 'Endpoint & EDR Copilot', domain: 'Process Trees' },
  { id: 'network-security', name: 'Network Intelligence Copilot', domain: 'NDR & Flows' },
  { id: 'supply-chain', name: 'Supply Chain Copilot', domain: 'SBOM & OSS' },
  { id: 'ai-security', name: 'AI & Agent Security Copilot', domain: 'LLM Defense' },
  { id: 'governance', name: 'GRC & Incident Copilot', domain: 'NIST CSF & IR' }
];

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
  activeIndicator?: string;
}

export default function AIAssistantDrawer({
  isOpen,
  onClose,
  defaultDomain = 'threat-intelligence',
  activeIndicator
}: AIAssistantDrawerProps) {
  const [selectedDomain, setSelectedDomain] = useState(defaultDomain);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; tools?: string[] }>>([
    {
      role: 'assistant',
      text: `Hello! I am your **${ASSISTANT_OPTIONS.find(a => a.id === defaultDomain)?.name || 'ThreatGuard AI Assistant'}**.\n\nI have authorized access to organization telemetry, MCP security tools, and enriched feeds. How can I assist your investigation?`,
      tools: ['check_ip_reputation', 'search_attack_techniques']
    }
  ]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    "Investigate active C2 indicator",
    "Map telemetry to MITRE ATT&CK",
    "Summarize critical alert queue"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(({ role, text }) => ({ role, content: text }));
      const data = await api.chatWithAssistant(selectedDomain, userMsg, activeIndicator, history);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.response,
          tools: ['retrieve_security_alert', 'search_attack_techniques']
        }
      ]);
      if (data.suggested_actions && data.suggested_actions.length > 0) {
        setSuggestedActions(data.suggested_actions);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered an error querying the intelligence pipeline. Telemetry remains active in the Security Command Center."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentAssistant = ASSISTANT_OPTIONS.find(a => a.id === selectedDomain) || ASSISTANT_OPTIONS[0];

  return (
    <div className="fixed inset-y-0 right-0 w-[440px] bg-[#0F0E18]/95 backdrop-blur-xl border-l border-purple-500/20 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/15 flex items-center justify-between bg-[#030305]/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B0A10] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white tracking-wide">
              {currentAssistant.name}
            </div>
            <div className="text-[10px] text-purple-300 font-mono">{currentAssistant.domain}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-[#0B0A10] hover:bg-[#030305] border border-purple-500/15 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Assistant Domain Switcher Dropdown */}
      <div className="px-4 py-2.5 bg-[#080714]/80 border-b border-purple-500/15 flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-mono text-[11px]">Domain Specialist:</span>
        <select
          value={selectedDomain}
          onChange={(e) => {
            const newDomain = e.target.value;
            setSelectedDomain(newDomain);
            const found = ASSISTANT_OPTIONS.find(a => a.id === newDomain);
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                text: `Switched context to **${found?.name}**. Specialized domain instructions and MCP tools for **${found?.domain}** are now active.`
              }
            ]);
          }}
          className="bg-[#0B0A10] border border-purple-500/25 rounded-md text-white text-[11px] px-2 py-1 focus:outline-none focus:border-purple-500 font-mono"
        >
          {ASSISTANT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id} className="bg-[#080714] text-white">
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Indicator Scope Banner */}
      {activeIndicator && (
        <div className="px-4 py-1.5 bg-[#0B0A10] border-b border-purple-500/15 text-[11px] font-mono text-purple-300 flex items-center justify-between">
          <span>In Scope: <strong className="text-white">{activeIndicator}</strong></span>
          <span className="text-[10px] text-violet-300">Loaded in Context</span>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-zinc-400">
              {msg.role === 'user' ? (
                <>
                  <span>Security Analyst</span>
                  <User className="w-3 h-3 text-purple-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300">ThreatGuard AI</span>
                </>
              )}
            </div>

            <div
              className={`p-3.5 rounded-xl max-w-[90%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0B0A10] border border-purple-500/15 text-white'
                  : 'bg-[#080714]/90 border border-purple-500/25 text-white/95 shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.tools && msg.tools.length > 0 && (
                <div className="mt-3 pt-2 border-t border-purple-500/15 flex flex-wrap gap-1.5">
                  {msg.tools.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#030305] border border-purple-500/15 text-[10px] font-mono text-purple-300"
                    >
                      <Terminal className="w-2.5 h-2.5" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-purple-300 font-mono text-xs p-3 rounded-lg bg-[#080714]/60 border border-purple-500/15">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>Querying MCP tools & correlating threat graph...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-[#030305]/80 border-t border-purple-500/15">
        <div className="text-[10px] font-mono text-zinc-400 mb-1.5 uppercase">Suggested Queries:</div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(action)}
              className="text-[11px] bg-[#0B0A10] hover:bg-[#030305] text-zinc-300 hover:text-purple-300 border border-purple-500/15 px-2 py-1 rounded-md transition-colors font-mono"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-[#030305] border-t border-purple-500/15">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${currentAssistant.name}...`}
            className="flex-1 bg-[#0B0A10] border border-purple-500/15 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 font-mono"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="w-9 h-9 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 disabled:opacity-40 text-purple-200 border border-purple-500/30 flex items-center justify-center transition-colors shadow-[0_0_12px_rgba(147,51,234,0.2)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
