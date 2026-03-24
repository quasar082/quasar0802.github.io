'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Watches a container element with ResizeObserver and calls
 * ScrollTrigger.refresh() with a 250ms debounce when size changes.
 *
 * Use on any component that changes page height dynamically
 * (accordion, image load, content toggle).
 */
export function useScrollTriggerRefresh(
  containerRef: React.RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const debouncedRefresh = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    const observer = new ResizeObserver(debouncedRefresh);
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, [containerRef, ...deps]);
}
