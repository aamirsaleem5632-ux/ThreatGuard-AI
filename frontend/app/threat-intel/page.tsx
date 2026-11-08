'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radio,
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const FEEDS = [
  { name: 'AbuseIPDB API', desc: 'Real-time IP reputation, confidence scoring, and global abusive host complaint logs.', url: 'https://www.abuseipdb.com/api', status: 'Integrated & Active' },
  { name: 'URLhaus (abuse.ch)', desc: 'Malicious URL intelligence, malware distribution endpoints, and payload tags.', url: 'https://urlhaus.abuse.ch/api/', status: 'Integrated & Active' },
  { name: 'National Vulnerability Database (NVD)', desc: 'NIST official repository for CVEs, CVSS v3.1/v4.0 metrics, and vulnerability descriptions.', url: 'https://nvd.nist.gov/developers', status: 'Integrated & Active' },
  { name: 'MITRE ATT&CK Enterprise Matrix', desc: 'Adversary tactics, techniques, and procedures (TTPs) correlation and attribution.', url: 'https://attack.mitre.org/', status: 'Integrated & Active' },
  { name: 'Google Gemini API', desc: 'High-reasoning generative intelligence powering the 12 specialized cybersecurity assistants.', url: 'https://ai.google.dev/', status: 'Connected' }
];

export default function ThreatIntelPage() {
  return (
    <div className="space-y-12 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-cyber-white tracking-tight">
          External Threat Intelligence Feeds
        </h1>
        <p className="text-sm text-cyber-muted font-mono leading-relaxed">
          ThreatGuard AI integrates leading open and commercial cybersecurity intelligence sources, normalizing threat telemetry into a unified forensic evidence graph.
        </p>
      </div>

      <div className="space-y-4">
        {FEEDS.map((feed, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-cyber-card border border-cyber-card flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-cyber-white">{feed.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-deep border border-cyber-cyan/30 text-cyber-cyan">
                  {feed.status}
                </span>
              </div>
              <p className="text-xs text-cyber-muted max-w-2xl">{feed.desc}</p>
            </div>

            <a
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-cyber-muted hover:text-cyber-cyan flex items-center gap-1.5 self-start md:self-center"
            >
              <span>Official Specs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <Link
          href="/threat-intelligence"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-cyan text-cyber-deep font-bold font-mono text-xs shadow-cyber-cyan hover:bg-cyber-cyan/90 transition-colors"
        >
          <span>Open Threat Intelligence Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
