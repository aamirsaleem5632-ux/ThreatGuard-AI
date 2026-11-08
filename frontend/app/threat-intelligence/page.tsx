'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Radio } from 'lucide-react';

export default function ThreatIntelligencePage() {
  return (
    <DomainWorkspace
      domainId="threat-intelligence"
      domainName="Threat Intelligence & Investigation"
      badge="Module 01: CTI"
      icon={Radio}
    />
  );
}
