'use client';

import React from 'react';
import DomainWorkspace from '@/components/dashboard/DomainWorkspace';
import { MailWarning } from 'lucide-react';

export default function PhishingPage() {
  return (
    <DomainWorkspace
      domainId="phishing"
      domainName="Email, Phishing & Fraud Intelligence"
      badge="Module 07: Phishing"
      icon={MailWarning}
    />
  );
}
