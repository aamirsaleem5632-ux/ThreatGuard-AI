'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radio,
  Crosshair,
  Bug,
  Code2,
  Cloud,
  Fingerprint,
  MailWarning,
  Cpu,
  Network,
  Boxes,
  Bot,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

const SOLUTIONS = [
  { id: 'threat-intelligence', title: 'Module 01: Threat Intelligence & Investigation', icon: Radio, role: 'Collect, analyse and investigate suspicious indicators (IPs, domains, hashes), threat actors, and MITRE ATT&CK TTPs.' },
  { id: 'soc', title: 'Module 02: Security Operations Center (SOC)', icon: Crosshair, role: 'Centralized alert monitoring, automated alert triage, incident timeline correlation, and MTTD/MTTR management.' },
  { id: 'vulnerabilities', title: 'Module 03: Vulnerability Management', icon: Bug, role: 'NVD CVE research, CVSS v3.1/v4.0 scoring, EPSS exploit likelihood analysis, and patch tracking.' },
  { id: 'application-security', title: 'Module 04: Application & API Security', icon: Code2, role: 'OWASP Top 10 mitigation, API authentication audits, and secure code review guidance.' },
  { id: 'cloud-security', title: 'Module 05: Cloud Security (CSPM)', icon: Cloud, role: 'Multi-cloud configuration assessment, excessive IAM privilege detection, and storage bucket compliance.' },
  { id: 'identity-security', title: 'Module 06: Identity & Access Security (ITDR)', icon: Fingerprint, role: 'Impossible travel anomalies, privileged account monitoring, Kerberoasting detection, and MFA enforcement.' },
  { id: 'phishing', title: 'Module 07: Email, Phishing & Fraud Intelligence', icon: MailWarning, role: 'Deceptive domain identification, email header forensic analysis (SPF/DKIM/DMARC), and brand abuse protection.' },
  { id: 'endpoint-security', title: 'Module 08: Endpoint, Malware & Ransomware Security', icon: Cpu, role: 'Endpoint telemetry investigation, binary sandboxing, shadow copy deletion blocking, and host quarantine.' },
  { id: 'network-security', title: 'Module 09: Network Security Intelligence (NDR)', icon: Network, role: 'Anomalous traffic flow detection, C2 beaconing analysis, DNS tunneling identification, and perimeter firewall rules.' },
  { id: 'supply-chain', title: 'Module 10: Software Supply Chain Security (SBOM)', icon: Boxes, role: 'Software Bill of Materials (SBOM) audits, open-source dependency vulnerability scans, and vendor risk profiles.' },
  { id: 'ai-security-module', title: 'Module 11: AI & Autonomous Agent Security', icon: Bot, role: 'LLM prompt injection vector auditing, autonomous agent permission boundaries, and sensitive data leakage guardrails.' },
  { id: 'governance', title: 'Module 12: Governance, Risk, Compliance & Incident Response', icon: FileCheck2, role: 'NIST CSF 2.0 / ISO 27001 control mapping, corporate risk register tracking, and incident response playbooks.' }
];

export default function SolutionsPage() {
  return (
    <div className="space-y-12 py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Twelve Specialized Cybersecurity Domains
        </h1>
        <p className="text-sm text-zinc-400 font-mono leading-relaxed">
          Explore each independent cybersecurity domain. Every module features its own dedicated dashboard, specialized AI assistant, active findings table, and task tracker.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOLUTIONS.map((sol) => {
          const Icon = sol.icon;
          return (
            <div
              key={sol.id}
              className="p-6 rounded-2xl bg-[#0B0A10] border border-purple-500/15 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(201,168,68,0.2)] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#030305] border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(201,168,68,0.2)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{sol.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{sol.role}</p>
              </div>

              <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs font-mono text-purple-300">
                <Link href={`/${sol.id}`} className="hover:text-purple-200 flex items-center gap-1.5 transition-colors">
                  <span>Enter Module Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
