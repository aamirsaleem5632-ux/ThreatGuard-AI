'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Network } from 'lucide-react';

export default function NetworkSecurityPage() {
  return (
    <DomainWorkspace
      domainId="network-security"
      domainName="Network Security Intelligence (NDR)"
      badge="Module 09: NDR"
      icon={Network}
    />
  );
}
