'use client';

import {useRef, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {useLenis} from 'lenis/react';

const SEPARATOR = '\u00A0\u2014\u00A0';

export function Marquee() {
  const t = useTranslations('Hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef({current: 0, speed: 1, direction: 1}); // 1 = left-to-right base

  const marqueeText = t('marquee');

  useGSAP(
    () => {
      const track = containerRef.current?.querySelector(
        '[data-marquee-track]'
      ) as HTMLElement | null;
      if (!track) return;

      // Measure one item width (all items identical)
      const item = track.children[0] as HTMLElement;
      if (!item) return;
      const itemWidth = item.offsetWidth;
      const resetAt = itemWidth * 2; // 4 copies, reset after 2 scroll out

      const state = xRef.current;
      const baseSpeed = 1.5; // px per frame — brisk default

      gsap.ticker.add(() => {
        // direction: -1 = move left (default auto), +1 = move right (reversed on scroll down)
        const velocity = baseSpeed * state.speed * state.direction;
        state.current -= velocity;

        // Wrap seamlessly: when shifted left by 2 items, snap back
        if (state.current <= -resetAt) {
          state.current += resetAt;
        }
        // When reversed direction pushes right past 0, wrap forward
        if (state.current >= 0) {
          state.current -= resetAt;
        }

        gsap.set(track, {x: state.current});
      });
    },
    {scope: containerRef}
  );

  const lenisCallback = useCallback((lenis: {velocity: number}) => {
    const state = xRef.current;
    const vel = lenis.velocity;
    const absVel = Math.abs(vel);

    if (absVel < 0.1) {
      // Idle: return to default direction, normal speed
      state.direction = -1; // left (default)
      state.speed = 1;
    } else {
      // Scrolling down (vel > 0): reverse direction (right-to-left becomes left-to-right visually reversed)
      state.direction = vel > 0 ? 1 : -1;
      // Speed: 1x base + proportional to velocity, up to 8x
      state.speed = 1 + Math.min(absVel * 1.5, 7);
    }
  }, []);

  useLenis(lenisCallback);

  const copies = Array.from({length: 4}, (_, i) => i);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        data-marquee-track=""
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {copies.map((i) => (
          <span
            key={i}
            aria-hidden={i > 0 ? 'true' : undefined}
            className="shrink-0 font-display font-[300] uppercase tracking-wider text-text-primary"
            style={{fontSize: 'var(--text-display-xxl)'}}
          >
            {marqueeText}
            {SEPARATOR}
          </span>
        ))}
      </div>
    </div>
  );
}
