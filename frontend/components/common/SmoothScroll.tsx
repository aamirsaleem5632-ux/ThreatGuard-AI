'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    let animationFrameId = 0;

    const stop = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      lenis?.destroy();
      lenis = undefined;
    };

    const start = () => {
      if (lenis || reducedMotion.matches) return;

      lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        anchors: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        animationFrameId = window.requestAnimationFrame(raf);
      };

      animationFrameId = window.requestAnimationFrame(raf);
    };

    const handleMotionPreferenceChange = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    start();
    reducedMotion.addEventListener('change', handleMotionPreferenceChange);
    return () => {
      reducedMotion.removeEventListener('change', handleMotionPreferenceChange);
      stop();
    };
  }, []);

  return null;
}
