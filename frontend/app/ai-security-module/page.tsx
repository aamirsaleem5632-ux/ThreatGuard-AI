'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Bot } from 'lucide-react';

export default function AISecurityModulePage() {
  return (
    <DomainWorkspace
      domainId="ai-security"
      domainName="AI & Autonomous Agent Security"
      badge="Module 11: LLM Defense"
      icon={Bot}
    />
  );
}
