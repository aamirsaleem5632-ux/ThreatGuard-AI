'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Crosshair } from 'lucide-react';

export default function SOCPage() {
  return (
    <DomainWorkspace
      domainId="soc"
      domainName="Security Operations Center (SOC)"
      badge="Module 02: SOC"
      icon={Crosshair}
    />
  );
}
