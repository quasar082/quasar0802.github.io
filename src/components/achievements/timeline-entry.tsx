'use client';

import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/animations/gsap';
import {usePreloaderDone} from '@/lib/hooks/use-preloader-done';

interface TimelineEntryProps {
  children: React.ReactNode;
  index: number;
}

export function TimelineEntry({children, index}: TimelineEntryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  useGSAP(
    () => {
      if (!ref.current || !preloaderDone) return;
      gsap.from(ref.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    {scope: ref, dependencies: [preloaderDone]},
  );

  return <div ref={ref}>{children}</div>;
}
