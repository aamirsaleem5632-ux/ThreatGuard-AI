'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { Boxes } from 'lucide-react';

export default function SupplyChainPage() {
  return (
    <DomainWorkspace
      domainId="supply-chain"
      domainName="Software Supply Chain Security (SBOM)"
      badge="Module 10: SBOM"
      icon={Boxes}
    />
  );
}
