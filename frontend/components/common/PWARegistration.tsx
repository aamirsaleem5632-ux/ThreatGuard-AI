'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('ThreatGuard service worker registration failed:', error);
    });
  }, []);

  return null;
}
