'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Code2 } from 'lucide-react';

export default function ApplicationSecurityPage() {
  return (
    <DomainWorkspace
      domainId="application-security"
      domainName="Application & API Security"
      badge="Module 04: OWASP / API"
      icon={Code2}
    />
  );
}
