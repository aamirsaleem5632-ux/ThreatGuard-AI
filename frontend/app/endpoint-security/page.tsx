'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Cpu } from 'lucide-react';

export default function EndpointSecurityPage() {
  return (
    <DomainWorkspace
      domainId="endpoint-security"
      domainName="Endpoint, Malware & Ransomware Security"
      badge="Module 08: EDR"
      icon={Cpu}
    />
  );
}
