'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLenis } from 'lenis/react';

const PRELOADER_KEY = 'rq-preloader-seen';
const HOMEPAGE_ROUTES = ['/', '/en', '/en/', '/vi', '/vi/'];

/**
 * Preloader with curtain-reveal animation.
 *
 * Anti-FOUC strategy:
 * - A pure-HTML black curtain (#preloader-curtain) is placed in layout.tsx
 *   OUTSIDE the React tree, so it's never wrapped in a hidden="" Suspense div.
 *   First paint is always black on homepage.
 * - An inline script in layout.tsx removes the curtain synchronously for
 *   non-homepage routes and returning visitors (sessionStorage check).
 * - This component renders text overlays and animates the curtain halves
 *   on first homepage visit, then removes the curtain on completion.
 */
export default function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const [phase, setPhase] = useState<'pending' | 'animate' | 'done'>('pending');

  // Decide after hydration: animate or skip
  useEffect(() => {
    const curtain = document.getElementById('preloader-curtain');
    // If inline script already removed the curtain, nothing to do
    if (!curtain) {
      setPhase('done');
      return;
    }

    const isHomepage = HOMEPAGE_ROUTES.includes(pathname);
    const alreadySeen = sessionStorage.getItem(PRELOADER_KEY) === 'true';

    if (isHomepage && !alreadySeen) {
      setPhase('animate');
    } else {
      curtain.remove();
      setPhase('done');
    }
  }, [pathname]);

  // Lock scroll during animation
  useEffect(() => {
    if (phase === 'animate' && lenis) {
      lenis.stop();
    }
  }, [lenis, phase]);

  const onSequenceComplete = useCallback(() => {
    lenis?.start();
    sessionStorage.setItem(PRELOADER_KEY, 'true');
    const curtain = document.getElementById('preloader-curtain');
    if (curtain) curtain.remove();
    setPhase('done');
  }, [lenis]);

  useGSAP(
    () => {
      if (phase !== 'animate') return;

      const curtain = document.getElementById('preloader-curtain');
      if (!curtain || !text1Ref.current || !text2Ref.current) return;

      const topHalf = curtain.children[0] as HTMLElement;
      const bottomHalf = curtain.children[1] as HTMLElement;
      if (!topHalf || !bottomHalf) return;

      // Enable pointer events during animation so curtain blocks interaction
      curtain.style.pointerEvents = 'auto';

      const tl = gsap.timeline({ onComplete: onSequenceComplete });

      tl.set(text1Ref.current, { opacity: 0 });
      tl.set(text2Ref.current, { opacity: 0 });

      // "Welcome to party" — fade in, hold, fade out
      tl.to(text1Ref.current, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      tl.to({}, { duration: 0.6 });
      tl.to(text1Ref.current, { opacity: 0, duration: 0.6, ease: 'power2.in' });

      // "Quasar" — fade in, hold, fade out
      tl.to(text2Ref.current, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      tl.to({}, { duration: 0.6 });
      tl.to(text2Ref.current, { opacity: 0, duration: 0.6, ease: 'power2.in' });

      // Curtain split-reveal
      tl.to(topHalf, { yPercent: -100, duration: 1, ease: 'power3.inOut' }, 'curtain');
      tl.to(bottomHalf, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, 'curtain');
    },
    { scope: containerRef, dependencies: [lenis, phase, onSequenceComplete] }
  );

  if (phase === 'done') return null;

  // Only render text overlays — curtain is in layout.tsx as pure HTML
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[61] pointer-events-none flex items-center justify-center"
    >
      <div
        ref={text1Ref}
        className="absolute font-display text-[clamp(1.5rem,4vw,3rem)] uppercase text-white font-light tracking-wider opacity-0"
      >
        Welcome to party
      </div>
      <div
        ref={text2Ref}
        className="absolute font-display text-[clamp(4rem,15vw,12rem)] uppercase text-white font-light tracking-wider opacity-0"
      >
        Quasar
      </div>
    </div>
  );
}
