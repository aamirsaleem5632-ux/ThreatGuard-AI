'use client';

import React from 'react';
import Link from 'next/link';
import {
  ExternalLink,
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
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          External Threat Intelligence Feeds
        </h1>
        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
          ThreatGuard AI integrates leading open and commercial cybersecurity intelligence sources, normalizing threat telemetry into a unified forensic evidence graph.
        </p>
      </div>

      <div className="space-y-4">
        {FEEDS.map((feed, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0B0A10] border border-purple-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{feed.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#030305] border border-purple-500/25 text-purple-300">
                  {feed.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-2xl">{feed.desc}</p>
            </div>

            <a
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-purple-300 flex items-center gap-1.5 self-start md:self-center transition-colors"
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-900/40 via-violet-800/20 to-transparent hover:from-purple-800/50 hover:to-violet-700/30 text-purple-200 border border-purple-500/30 font-bold font-mono text-xs shadow-[0_0_15px_rgba(201,168,68,0.2)] transition-all"
        >
          <span>Open Threat Intelligence Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
