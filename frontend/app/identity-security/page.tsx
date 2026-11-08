'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Fingerprint } from 'lucide-react';

export default function IdentitySecurityPage() {
  return (
    <DomainWorkspace
      domainId="identity-security"
      domainName="Identity & Access Security (ITDR)"
      badge="Module 06: ITDR"
      icon={Fingerprint}
    />
  );
}
