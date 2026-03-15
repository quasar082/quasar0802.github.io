'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {useLenis} from 'lenis/react';

const SEPARATOR = '\u00A0\u2014\u00A0'; // &nbsp;&mdash;&nbsp;

export function Marquee() {
  const t = useTranslations('Hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const marqueeText = t('marquee');

  useGSAP(
    () => {
      const track = containerRef.current?.querySelector(
        '[data-marquee-track]'
      ) as HTMLElement | null;
      if (!track) return;

      tweenRef.current = gsap.to(track, {
        xPercent: -25,
        repeat: -1,
        duration: 20,
        ease: 'none',
      });
    },
    {scope: containerRef}
  );

  useLenis((lenis) => {
    if (!tweenRef.current) return;

    const targetSpeed = 1 + Math.min(Math.abs(lenis.velocity) / 3, 2);

    gsap.to(tweenRef.current, {
      timeScale: targetSpeed,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    });
  });

  const copies = Array.from({length: 4}, (_, i) => i);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        data-marquee-track=""
        className="flex whitespace-nowrap will-change-transform"
      >
        {copies.map((i) => (
          <span
            key={i}
            aria-hidden={i > 0 ? 'true' : undefined}
            className="shrink-0 font-display font-[300] uppercase tracking-wider text-text-primary"
            style={{fontSize: 'var(--text-display-xl)'}}
          >
            {marqueeText}
            {SEPARATOR}
          </span>
        ))}
      </div>
    </div>
  );
}
