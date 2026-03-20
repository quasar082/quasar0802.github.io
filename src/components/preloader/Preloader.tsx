'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLenis } from 'lenis/react';

const PRELOADER_KEY = 'rq-preloader-seen';
const HOMEPAGE_ROUTES = ['/', '/en', '/en/', '/vi', '/vi/'];

export default function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  // Start as 'pending' — SSR always renders the black curtain.
  // After hydration, effect decides: 'animate' (run sequence) or 'dismiss' (skip instantly).
  const [phase, setPhase] = useState<'pending' | 'animate' | 'dismiss' | 'done'>('pending');
  const lenis = useLenis();

  // Decide on hydration whether to animate or dismiss
  useEffect(() => {
    const isHomepage = HOMEPAGE_ROUTES.includes(pathname);
    const alreadySeen = sessionStorage.getItem(PRELOADER_KEY) === 'true';

    if (isHomepage && !alreadySeen) {
      setPhase('animate');
    } else {
      // Not needed — dismiss instantly
      setPhase('dismiss');
    }
  }, [pathname]);

  // When dismissed, remove body class and unmount
  useEffect(() => {
    if (phase === 'dismiss') {
      document.body.classList.remove('preloader-pending');
      // Small delay so React can commit the state before we set done
      const raf = requestAnimationFrame(() => setPhase('done'));
      return () => cancelAnimationFrame(raf);
    }
  }, [phase]);

  // Lock scroll when animating
  useEffect(() => {
    if (phase === 'animate' && lenis) {
      lenis.stop();
    }
  }, [lenis, phase]);

  const onSequenceComplete = useCallback(() => {
    lenis?.start();
    sessionStorage.setItem(PRELOADER_KEY, 'true');
    document.body.classList.remove('preloader-pending');
    setPhase('done');
  }, [lenis]);

  useGSAP(
    () => {
      if (phase !== 'animate') return;
      if (
        !text1Ref.current ||
        !text2Ref.current ||
        !topHalfRef.current ||
        !bottomHalfRef.current
      )
        return;

      const tl = gsap.timeline({ onComplete: onSequenceComplete });

      // Initial state: both texts invisible
      tl.set(text1Ref.current, { opacity: 0 });
      tl.set(text2Ref.current, { opacity: 0 });

      // Phase 1: "Welcome to party" — fade in whole sentence
      tl.to(text1Ref.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });
      // Hold
      tl.to({}, { duration: 0.6 });
      // Fade out whole sentence
      tl.to(text1Ref.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
      });

      // Phase 2: "Quasar" — fade in whole word
      tl.to(text2Ref.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });
      // Hold
      tl.to({}, { duration: 0.6 });
      // Fade out whole word
      tl.to(text2Ref.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
      });

      // Phase 3: Curtain split-reveal
      tl.to(
        topHalfRef.current,
        { yPercent: -100, duration: 1, ease: 'power3.inOut' },
        'curtain'
      );
      tl.to(
        bottomHalfRef.current,
        { yPercent: 100, duration: 1, ease: 'power3.inOut' },
        'curtain'
      );
    },
    { scope: containerRef, dependencies: [lenis, phase, onSequenceComplete] }
  );

  // Fully done — unmount
  if (phase === 'done') return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60]" data-preloader>
      {/* Text container: centered, above curtain halves */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
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
      {/* Curtain halves */}
      <div
        ref={topHalfRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-black"
      />
      <div
        ref={bottomHalfRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
      />
    </div>
  );
}
