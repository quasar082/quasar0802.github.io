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

  // Image parallax (D-19): matches HeroSection pattern
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
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  // Content block parallax (D-35): subtle vertical shift
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
      style={{
        paddingTop: 'var(--spacing-section)',
        paddingBottom: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        {/* About Title (D-10, D-11) */}
        <div className="mb-12 text-center">
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

        {/* Content Block 1: Overview / Myself (D-12 to D-16) */}
        <div
          ref={contentBlock1Ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]"
        >
          {/* Left: Labels */}
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
          {/* Right: Bio paragraphs */}
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

        {/* Floating Gundam Image (D-17 to D-20) */}
        <div
          className="overflow-hidden"
          style={{marginTop: '80px', marginBottom: '80px'}}
        >
          <div ref={imageRef} className="max-w-[85%] md:max-w-[70%] lg:max-w-[60%]">
            <img
              src="/images/about-gundam.png"
              alt="Gundam mech artwork"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content Block 2: Boring part / Experience with (D-21 to D-24) */}
        <div
          ref={contentBlock2Ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]"
        >
          {/* Left: Labels */}
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
          {/* Right: Tech list paragraphs */}
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

      {/* Services Block (D-25 to D-30) */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <ServicesBlock />
      </div>
    </section>
  );
}
