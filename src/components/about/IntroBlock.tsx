'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {TextReveal} from '@/components/animations/TextReveal';
import {DownloadCvButton} from '@/components/about/DownloadCvButton';
import {gsap, useGSAP} from '@/lib/gsap';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';

export function IntroBlock() {
  const t = useTranslations('About');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cvBtnWrapRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // Image parallax
  useGSAP(
    () => {
      if (!preloaderDone || !imageRef.current) return;
      gsap.fromTo(
        imageRef.current,
        {yPercent: 10},
        {
          yPercent: -10,
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

  // CV button scroll-triggered reveal
  useGSAP(
    () => {
      if (!preloaderDone || !cvBtnWrapRef.current) return;
      gsap.from(cvBtnWrapRef.current, {
        y: 30,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cvBtnWrapRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    },
    {scope: containerRef, dependencies: [preloaderDone]},
  );

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-0">
      {/* Left column: text content — 6 cols */}
      <div className="md:[grid-column:1/7] flex flex-col justify-center">
        {/* Subtitle */}
        <div className="flex items-center gap-2 mb-12">
          <span className="text-text-muted" style={{fontSize: 'var(--text-base)'}}>✦</span>
          <span
            className="font-body text-text-muted uppercase tracking-wider"
            style={{fontSize: 'var(--text-sm)'}}
          >
            {t('introSubtitle')}
          </span>
        </div>

        {/* Big heading — uppercase, reduced size */}
        <TextReveal
          as="h2"
          type="words"
          stagger={0.03}
          className="font-display text-text-primary uppercase"
          style={{
            fontSize: 'var(--text-display-md)',
            fontWeight: 'var(--font-weight-display)',
            lineHeight: '1.1',
          }}
        >
          {t('introHeading')}
        </TextReveal>

        {/* Tagline — right aligned */}
        <div className="flex justify-end mt-12">
          <TextReveal
            as="p"
            type="words"
            stagger={0.04}
            className="font-body text-text-secondary text-right"
            style={{
              fontSize: 'var(--text-lg)',
              lineHeight: '1.5',
            }}
          >
            {t('introTagline')}
          </TextReveal>
        </div>

        {/* Download CV button — right aligned */}
        <div ref={cvBtnWrapRef} className="flex justify-end mt-8">
          <DownloadCvButton />
        </div>
      </div>

      {/* Right column: image — 3 cols (col 8-10, col 7 is spacer) */}
      <div
        ref={imageRef}
        className="relative overflow-hidden md:[grid-column:8/11] self-center"
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
