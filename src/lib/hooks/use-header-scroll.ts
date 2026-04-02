'use client';

import {useRef, useEffect} from 'react';
import {useLenis} from 'lenis/react';
import {gsap} from '@/lib/animations/gsap';

interface UseHeaderScrollOptions {
  headerRef: React.RefObject<HTMLElement | null>;
  menuOpen: boolean;
  onScrollClose?: () => void;
}

export function useHeaderScroll({headerRef, menuOpen, onScrollClose}: UseHeaderScrollOptions): void {
  const lastDirectionChangeY = useRef(0);
  const isVisible = useRef(true);
  const prevDirection = useRef<1 | -1 | 0>(0);
  const menuOpenRef = useRef(menuOpen);
  const scrollAnchor = useRef(0);
  const scrollCloseFired = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Track menuOpen changes
  useEffect(() => {
    const wasOpen = menuOpenRef.current;
    menuOpenRef.current = menuOpen;

    if (menuOpen && !wasOpen) {
      // Menu just opened - show header immediately and set scroll anchor
      if (headerRef.current) {
        gsap.to(headerRef.current, {y: '0%', duration: reducedMotion.current ? 0 : 0.4, ease: 'power3.inOut', overwrite: 'auto'});
      }
      isVisible.current = true;
      scrollCloseFired.current = false;
    }
  }, [menuOpen, headerRef]);

  useLenis((lenis) => {
    if (!headerRef.current) return;

    const scrollY = lenis.animatedScroll;
    const direction = lenis.direction as 1 | -1 | 0;
    const dur = reducedMotion.current ? 0 : 0.4;

    // Record scroll anchor when menu opens
    if (menuOpenRef.current && !scrollCloseFired.current) {
      if (scrollAnchor.current === 0) {
        scrollAnchor.current = scrollY;
      }
      // Check scroll-close threshold (50px)
      if (Math.abs(scrollY - scrollAnchor.current) > 50) {
        scrollCloseFired.current = true;
        onScrollClose?.();
      }
    } else if (!menuOpenRef.current) {
      scrollAnchor.current = 0;
    }

    // Force visible when menu is open
    if (menuOpenRef.current) {
      if (!isVisible.current) {
        gsap.to(headerRef.current, {y: '0%', duration: dur, ease: 'power3.inOut', overwrite: 'auto'});
        isVisible.current = true;
      }
      return;
    }

    // Always show at top
    if (scrollY < 80) {
      if (!isVisible.current) {
        gsap.to(headerRef.current, {y: '0%', duration: dur, ease: 'power3.inOut', overwrite: 'auto'});
        isVisible.current = true;
      }
      lastDirectionChangeY.current = scrollY;
      prevDirection.current = direction;
      return;
    }

    // Detect direction change
    if (direction !== prevDirection.current && direction !== 0) {
      lastDirectionChangeY.current = scrollY;
      prevDirection.current = direction;
    }

    // Scrolling down - hide after 80px
    if (direction === 1 && isVisible.current) {
      if (scrollY - lastDirectionChangeY.current > 80) {
        gsap.to(headerRef.current, {y: '-100%', duration: dur, ease: 'power3.inOut', overwrite: 'auto'});
        isVisible.current = false;
      }
    }

    // Scrolling up - reveal after 20px
    if (direction === -1 && !isVisible.current) {
      if (lastDirectionChangeY.current - scrollY > 20) {
        gsap.to(headerRef.current, {y: '0%', duration: dur, ease: 'power3.inOut', overwrite: 'auto'});
        isVisible.current = true;
      }
    }
  }, [menuOpen, onScrollClose]);
}
