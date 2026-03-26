'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';
import {TextReveal} from '@/components/animations/TextReveal';
import {ServicesBlock} from '@/components/about/ServicesBlock';

export function AboutSection() {
  const t = useTranslations('About');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentBlock1Ref = useRef<HTMLDivElement>(null);
  const contentBlock2Ref = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // Image parallax: slower scrub for "behind content" feel
  useGSAP(
    () => {
      if (!preloaderDone || !imageRef.current) return;
      gsap.fromTo(
        imageRef.current,
        {yPercent: 5},
        {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  // Content block parallax: subtle vertical shift
  useGSAP(
    () => {
      if (!preloaderDone) return;
      const blocks = [contentBlock1Ref.current, contentBlock2Ref.current].filter(Boolean);
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          {yPercent: 5},
          {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: block,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Background image — absolute, left-shifted, vertically centered, 90vh */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{left: '-10%', height: '90vh', width: 'auto'}}
      >
        <img
          src="/images/about-deepstriker.png"
          alt="Deep Striker mech artwork"
          className="h-full w-auto object-contain"
          loading="lazy"
        />
        {/* White blur edges on all 4 sides */}
        <div
          className="absolute inset-x-0 top-0 h-[35%]"
          style={{background: 'linear-gradient(to bottom, var(--warm-white) 0%, transparent 100%)'}}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[35%]"
          style={{background: 'linear-gradient(to top, var(--warm-white) 0%, transparent 100%)'}}
        />
        <div
          className="absolute inset-y-0 left-0 w-[30%]"
          style={{background: 'linear-gradient(to right, var(--warm-white) 0%, transparent 100%)'}}
        />
        <div
          className="absolute inset-y-0 right-0 w-[30%]"
          style={{background: 'linear-gradient(to left, var(--warm-white) 0%, transparent 100%)'}}
        />
      </div>

      {/* ===== PART 1: "Knock knock" + 2 content blocks ===== */}
      <div
        className="relative z-10"
        style={{paddingTop: '10rem', paddingBottom: '10rem'}}
      >
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          {/* About Title */}
          <div className="mb-16 text-center">
            <TextReveal
              as="h2"
              type="words"
              stagger={0.04}
              className="font-display text-text-primary"
              style={{
                fontSize: 'var(--text-display-md)',
                fontWeight: 'var(--font-weight-display)',
                lineHeight: '1.2',
              }}
            >
              {t('title')}
            </TextReveal>
          </div>

          {/* Content Block 1: Overview / Myself */}
          <div
            ref={contentBlock1Ref}
            className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]"
          >
            <div className="flex flex-col gap-2">
              <span
                className="font-body text-text-muted"
                style={{fontSize: 'var(--text-sm)'}}
              >
                {t('overviewLabel')}
              </span>
              <span
                className="font-display text-text-primary"
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-display)',
                }}
              >
                {t('myselfLabel')}
              </span>
            </div>
            <div className="space-y-8">
              <TextReveal
                as="p"
                type="lines"
                stagger={0.05}
                className="font-body text-text-secondary"
                style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
              >
                {t('bio1')}
              </TextReveal>
              <TextReveal
                as="p"
                type="lines"
                stagger={0.05}
                className="font-body text-text-secondary"
                style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
              >
                {t('bio2')}
              </TextReveal>
            </div>
          </div>

          {/* Inner spacer between content blocks (smaller than section spacing) */}
          <div style={{height: '4rem'}} />

          {/* Content Block 2: Boring part / Experience with */}
          <div
            ref={contentBlock2Ref}
            className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]"
          >
            <div className="flex flex-col gap-2">
              <span
                className="font-body text-text-muted"
                style={{fontSize: 'var(--text-sm)'}}
              >
                {t('boringLabel')}
              </span>
              <span
                className="font-display text-text-primary"
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-display)',
                }}
              >
                {t('experienceLabel')}
              </span>
            </div>
            <div className="space-y-8">
              <TextReveal
                as="p"
                type="lines"
                stagger={0.05}
                className="font-body text-text-secondary"
                style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
              >
                {t('tech1')}
              </TextReveal>
              <TextReveal
                as="p"
                type="lines"
                stagger={0.05}
                className="font-body text-text-secondary"
                style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
              >
                {t('tech2')}
              </TextReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PART 2: "I can help you with" + 3 service cards ===== */}
      <div
        className="relative z-10"
        style={{paddingTop: '10rem', paddingBottom: '10rem'}}
      >
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          <ServicesBlock />
        </div>
      </div>
    </section>
  );
}
