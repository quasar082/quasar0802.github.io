'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations/gsap';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false, // CRITICAL: GSAP ticker drives Lenis RAF — prevents double RAF loops
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

/**
 * Bridges Lenis scroll to GSAP ScrollTrigger.
 *
 * Pattern from Lenis official README (GSAP ScrollTrigger section):
 * 1. lenis.on('scroll', ScrollTrigger.update) — sync scroll position
 * 2. gsap.ticker.add() drives lenis.raf() — single RAF loop
 * 3. gsap.ticker.lagSmoothing(0) — prevent GSAP from throttling
 */
function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Sync: pipe Lenis scroll events into ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single RAF source)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  return null;
}
