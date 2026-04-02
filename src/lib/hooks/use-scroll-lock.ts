'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

// Module-level ref count shared across all hook instances
let lockCount = 0;

/**
 * Ref-counted scroll lock hook that coordinates Lenis stop/start
 * across multiple overlays. Only the last unlock actually re-enables scroll.
 *
 * Safety: automatically unlocks on component unmount.
 */
export function useScrollLock() {
  const lenis = useLenis();
  const isLockedByThis = useRef(false);

  const lock = useCallback(() => {
    if (!lenis || isLockedByThis.current) return;
    isLockedByThis.current = true;
    lockCount++;
    if (lockCount === 1) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    }
  }, [lenis]);

  const unlock = useCallback(() => {
    if (!lenis || !isLockedByThis.current) return;
    isLockedByThis.current = false;
    lockCount--;
    if (lockCount === 0) {
      lenis.start();
      document.body.style.overflow = '';
    }
  }, [lenis]);

  // Safety: unlock on unmount
  useEffect(() => {
    return () => {
      if (isLockedByThis.current && lenis) {
        isLockedByThis.current = false;
        lockCount--;
        if (lockCount === 0) {
          lenis.start();
          document.body.style.overflow = '';
        }
      }
    };
  }, [lenis]);

  return { lock, unlock };
}
