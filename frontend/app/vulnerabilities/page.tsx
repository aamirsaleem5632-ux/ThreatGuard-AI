'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Bug } from 'lucide-react';

export default function VulnerabilitiesPage() {
  return (
    <DomainWorkspace
      domainId="vulnerabilities"
      domainName="Vulnerability Management"
      badge="Module 03: CVE / EPSS"
      icon={Bug}
    />
  );
}
