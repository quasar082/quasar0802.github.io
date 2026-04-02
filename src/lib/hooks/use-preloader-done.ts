'use client';

import {useEffect, useState} from 'react';
import {usePreloaderStore} from '@/lib/stores/use-preloader-store';

/**
 * Returns `true` once the preloader animation has completed.
 * Components can use this to delay their own animations until the preloader finishes.
 */
export function usePreloaderDone(): boolean {
  const done = usePreloaderStore((s) => s.done);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (done) setReady(true);
  }, [done]);

  return ready;
}
