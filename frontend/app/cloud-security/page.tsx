'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Cloud } from 'lucide-react';

export default function CloudSecurityPage() {
  return (
    <DomainWorkspace
      domainId="cloud-security"
      domainName="Cloud Security (CSPM & CIEM)"
      badge="Module 05: CSPM"
      icon={Cloud}
    />
  );
}
