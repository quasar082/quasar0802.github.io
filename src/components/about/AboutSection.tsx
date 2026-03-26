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
  const topImageRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const bottomImageRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // Top image parallax
  useGSAP(
    () => {
      if (!preloaderDone || !topImageRef.current) return;
      gsap.fromTo(
        topImageRef.current,
        {yPercent: 12},
        {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: topImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  // Top text parallax
  useGSAP(
    () => {
      if (!preloaderDone || !topTextRef.current) return;
      gsap.fromTo(
        topTextRef.current,
        {yPercent: 6},
        {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: topTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  // Bottom text parallax
  useGSAP(
    () => {
      if (!preloaderDone || !bottomTextRef.current) return;
      gsap.fromTo(
        bottomTextRef.current,
        {yPercent: 8},
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  // Bottom image parallax — strongest
  useGSAP(
    () => {
      if (!preloaderDone || !bottomImageRef.current) return;
      gsap.fromTo(
        bottomImageRef.current,
        {yPercent: 30},
        {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: bottomImageRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    {scope: sectionRef, dependencies: [preloaderDone]},
  );

  return (
    <section ref={sectionRef} className="overflow-hidden">
      {/* ===== PART 1: Introduction ===== */}
      <div style={{paddingTop: '14rem'}}>
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          {/* Large heading — full width */}
          <div className="mb-20 md:mb-32">
            <TextReveal
              as="h2"
              type="words"
              stagger={0.04}
              className="font-display text-text-primary"
              style={{
                fontSize: 'var(--text-display-xxl)',
                fontWeight: 'var(--font-weight-display)',
                lineHeight: '1.05',
              }}
            >
              {t('introHeading')}
            </TextReveal>
          </div>

          {/* Top row: Image left (4/7) + Text right (3/7) */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-30 items-start">
            {/* Image — clips to grid cell, overflows only left via negative margin */}
            <div
              ref={topImageRef}
              className="relative order-2 md:order-1 md:col-span-4 md:-ml-12 lg:-ml-20 overflow-hidden"
            >
              <div className="relative">
                <img
                  src="/images/about-deepstriker.png"
                  alt="Deep Striker mech artwork"
                  className="w-full object-cover object-center"
                  style={{height: '75vh', minHeight: '600px'}}
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

            {/* Text — aligned to top of image row */}
            <div
              ref={topTextRef}
              className="relative z-10 order-1 md:order-2 md:col-span-3 flex flex-col justify-start"
            >
              {/* Subtitle with 4-pointed star icon */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-text-muted" style={{fontSize: 'var(--text-base)'}}>✦</span>
                <span
                  className="font-body text-text-muted uppercase tracking-wider"
                  style={{fontSize: 'var(--text-sm)'}}
                >
                  {t('aboutSubtitle')}
                </span>
              </div>

              {/* Bio text */}
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
                {t('introBio')}
              </TextReveal>
            </div>
          </div>

          {/* Bottom row: Text left (4/7) + Image right (3/7) */}
          <div
            className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-30 items-start"
            style={{marginTop: '6rem'}}
          >
            {/* Text with subtitle */}
            <div
              ref={bottomTextRef}
              className="relative z-10 md:col-span-4 flex flex-col justify-start pt-16"
            >
              {/* Subtitle */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-text-muted" style={{fontSize: 'var(--text-base)'}}>✦</span>
                <span
                  className="font-body text-text-muted uppercase tracking-wider"
                  style={{fontSize: 'var(--text-sm)'}}
                >
                  My Strength
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
                {t('introFocus')}
              </TextReveal>
            </div>

            {/* Image right — clips to grid cell, overflows only right via negative margin */}
            <div
              ref={bottomImageRef}
              className="md:col-span-3 md:-mr-12 lg:-mr-20 overflow-hidden"
              style={{marginTop: '-18rem'}}
            >
              <div className="relative">
                <img
                  src="/images/about-deepstriker.png"
                  alt="Deep Striker mech artwork"
                  className="w-full object-cover object-center"
                  style={{height: '75vh', minHeight: '500px'}}
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
        </div>
      </div>

      {/* ===== PART 2: "I can help you with" + 3 service cards ===== */}
      <div style={{paddingTop: '14rem'}}>
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8 lg:px-12">
          <ServicesBlock />
        </div>
      </div>
    </section>
  );
}
