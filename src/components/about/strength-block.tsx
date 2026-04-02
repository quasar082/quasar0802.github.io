'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {TextReveal} from '@/components/ui/text-reveal';
import {gsap, useGSAP} from '@/lib/animations/gsap';
import {usePreloaderDone} from '@/lib/hooks/use-preloader-done';

export function StrengthBlock() {
  const t = useTranslations('About');
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // Text parallax
  useGSAP(
    () => {
      if (!preloaderDone || !textRef.current) return;
      gsap.fromTo(
        textRef.current,
        {yPercent: 8},
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: containerRef, dependencies: [preloaderDone]},
  );

  // Image parallax
  useGSAP(
    () => {
      if (!preloaderDone || !imageRef.current) return;
      gsap.fromTo(
        imageRef.current,
        {yPercent: 14},
        {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: containerRef, dependencies: [preloaderDone]},
  );

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-0 mt-20">
      {/* Left: Text — 6 cols */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col justify-start md:[grid-column:1/5]"
      >
        {/* Subtitle */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-text-muted" style={{fontSize: 'var(--text-base)'}}>✦</span>
          <span
            className="font-body text-text-muted uppercase tracking-wider"
            style={{fontSize: 'var(--text-sm)'}}
          >
            {t('strengthSubtitle')}
          </span>
        </div>

        <TextReveal
          as="p"
          type="lines"
          stagger={0.05}
          className="font-body text-text-secondary"
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: '1.8',
          }}
        >
          {t('strengthBody')}
        </TextReveal>
      </div>

      {/* Right: Image — 3 cols (8-10, col 7 spacer) */}
      <div
        ref={imageRef}
        className="relative overflow-hidden self-end md:[grid-column:7/11]"
      >
        <div className="relative">
          <img
            src="/images/about-deepstriker.png"
            alt="Deep Striker mech artwork"
            className="w-full object-cover object-center"
            style={{height: '70vh', minHeight: '500px'}}
            loading="lazy"
          />
          {/* White blur edges */}
          <div
            className="absolute inset-x-0 top-0 h-[25%]"
            style={{background: 'linear-gradient(to bottom, var(--warm-white) 0%, transparent 100%)'}}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[25%]"
            style={{background: 'linear-gradient(to top, var(--warm-white) 0%, transparent 100%)'}}
          />
          <div
            className="absolute inset-y-0 left-0 w-[20%]"
            style={{background: 'linear-gradient(to right, var(--warm-white) 0%, transparent 100%)'}}
          />
          <div
            className="absolute inset-y-0 right-0 w-[20%]"
            style={{background: 'linear-gradient(to left, var(--warm-white) 0%, transparent 100%)'}}
          />
        </div>
      </div>
    </div>
  );
}
