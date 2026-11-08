'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { FileCheck2 } from 'lucide-react';

export default function GovernancePage() {
  return (
    <DomainWorkspace
      domainId="governance"
      domainName="Governance, Risk, Compliance & Incident Response"
      badge="Module 12: GRC & IR"
      icon={FileCheck2}
    />
  );
}
