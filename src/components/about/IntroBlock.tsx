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
  const cvBtnWrapRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

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
    <div ref={containerRef}>
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

      {/* Big heading — uppercase */}
      <TextReveal
        as="h2"
        type="words"
        stagger={0.03}
        className="font-display text-text-primary uppercase"
        style={{
          fontSize: 'var(--text-display-xxl)',
          fontWeight: 'var(--font-weight-display)',
          lineHeight: '1.05',
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
  );
}
