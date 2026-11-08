'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  Terminal,
  RotateCcw,
  CheckCircle2
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      const data = await api.chatWithAssistant(selectedDomain, userMsg, activeIndicator);
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
    <div className="fixed inset-y-0 right-0 w-[440px] bg-cyber-elevated/95 backdrop-blur-xl border-l border-cyber-card shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-cyber-card flex items-center justify-between bg-cyber-deep/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyber-card border border-cyber-gold/40 flex items-center justify-center text-cyber-gold shadow-cyber-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyber-white tracking-wide">
              {currentAssistant.name}
            </div>
            <div className="text-[10px] text-cyber-cyan font-mono">{currentAssistant.domain}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-cyber-card hover:bg-cyber-deep border border-cyber-card flex items-center justify-center text-cyber-muted hover:text-cyber-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Assistant Domain Switcher Dropdown */}
      <div className="px-4 py-2.5 bg-cyber-navy/60 border-b border-cyber-card flex items-center justify-between text-xs">
        <span className="text-cyber-muted font-mono text-[11px]">Domain Specialist:</span>
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
          className="bg-cyber-card border border-cyber-card rounded-md text-cyber-white text-[11px] px-2 py-1 focus:outline-none focus:border-cyber-cyan font-mono"
        >
          {ASSISTANT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id} className="bg-cyber-navy text-cyber-white">
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Indicator Scope Banner */}
      {activeIndicator && (
        <div className="px-4 py-1.5 bg-cyber-card/60 border-b border-cyber-card text-[11px] font-mono text-cyber-cyan flex items-center justify-between">
          <span>In Scope: <strong className="text-cyber-white">{activeIndicator}</strong></span>
          <span className="text-[10px] text-cyber-turquoise">Loaded in Context</span>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-cyber-muted">
              {msg.role === 'user' ? (
                <>
                  <span>Security Analyst</span>
                  <User className="w-3 h-3 text-cyber-gold" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-cyber-cyan" />
                  <span className="text-cyber-cyan">ThreatGuard AI</span>
                </>
              )}
            </div>

            <div
              className={`p-3.5 rounded-xl max-w-[90%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyber-card border border-cyber-card text-cyber-white'
                  : 'bg-cyber-navy/80 border border-cyber-card/80 text-cyber-white/95 shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.tools && msg.tools.length > 0 && (
                <div className="mt-3 pt-2 border-t border-cyber-card/60 flex flex-wrap gap-1.5">
                  {msg.tools.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyber-deep border border-cyber-card text-[10px] font-mono text-cyber-turquoise"
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
          <div className="flex items-center space-x-2 text-cyber-cyan font-mono text-xs p-3 rounded-lg bg-cyber-navy/50 border border-cyber-card">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping"></span>
            <span>Querying MCP tools & correlating threat graph...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-cyber-deep/70 border-t border-cyber-card">
        <div className="text-[10px] font-mono text-cyber-muted mb-1.5 uppercase">Suggested Queries:</div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(action)}
              className="text-[11px] bg-cyber-card hover:bg-cyber-card/80 text-cyber-white/80 hover:text-cyber-cyan border border-cyber-card px-2 py-1 rounded-md transition-colors font-mono"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-cyber-deep border-t border-cyber-card">
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
            className="flex-1 bg-cyber-card border border-cyber-card rounded-lg px-3.5 py-2 text-xs text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan font-mono"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="w-9 h-9 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan/30 disabled:opacity-40 text-cyber-cyan border border-cyber-cyan/40 flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
