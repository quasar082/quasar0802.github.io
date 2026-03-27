'use client';

import {useRef, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';
import {TextReveal} from '@/components/animations/TextReveal';
import {ServicesBlock} from '@/components/about/ServicesBlock';

function DownloadCvButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.backgroundColor = 'var(--greige-100)';
    // Slide dot out to right, slide icon in from left
    const dot = el.querySelector('.cv-dot') as HTMLElement;
    const icon = el.querySelector('.cv-icon') as HTMLElement;
    const textWrap = el.querySelector('.cv-text') as HTMLElement;
    const spans = el.querySelectorAll('.roll-text');
    if (dot) gsap.to(dot, {x: 20, opacity: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (icon) gsap.to(icon, {x: 0, opacity: 1, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (textWrap) gsap.to(textWrap, {x: 8, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    gsap.to(spans, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.backgroundColor = 'transparent';
    const dot = el.querySelector('.cv-dot') as HTMLElement;
    const icon = el.querySelector('.cv-icon') as HTMLElement;
    const textWrap = el.querySelector('.cv-text') as HTMLElement;
    const spans = el.querySelectorAll('.roll-text');
    if (dot) gsap.to(dot, {x: 0, opacity: 1, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (icon) gsap.to(icon, {x: -12, opacity: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (textWrap) gsap.to(textWrap, {x: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    gsap.to(spans, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  return (
    <a
      ref={btnRef}
      href="/cv.pdf"
      download
      className="inline-flex items-center cursor-pointer select-none font-body text-[15px] font-medium uppercase tracking-[0.08em]"
      style={{
        backgroundColor: 'transparent',
        color: 'var(--greige-900)',
        border: '1px solid var(--greige-900)',
        borderRadius: '9999px',
        height: '48px',
        paddingLeft: '30px',
        paddingRight: '32px',
        gap: '10px',
        transition: 'background-color 300ms ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Download icon — hidden by default, slides in on hover */}
      <span
        className="cv-icon"
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: 0,
          transform: 'translateX(-12px)',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>

      {/* Text with roll effect */}
      <div className="cv-text" style={{overflow: 'hidden', position: 'relative', height: '1em', lineHeight: 1}}>
        <span className="roll-text" style={{display: 'block'}}>Download CV</span>
        <span className="roll-text" style={{display: 'block'}}>Download CV</span>
      </div>

      {/* Single dot — slides out on hover */}
      <span
        className="cv-dot"
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: 'var(--greige-900)',
          flexShrink: 0,
        }}
      />
    </a>
  );
}

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
        {yPercent: 18},
        {
          yPercent: -18,
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

          {/* Single grid layout — image 2 overlaps into row 1 via grid placement */}
          <div
            className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-30"
            style={{gridTemplateRows: 'auto auto'}}
          >
            {/* Row 1, Col 1-4: Image left */}
            <div
              ref={topImageRef}
              className="relative order-2 md:order-1 md:col-span-4 md:-ml-12 lg:-ml-20 overflow-hidden"
              style={{gridRow: '1', gridColumn: '1 / 5'}}
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

            {/* Row 1, Col 5-7: Text right */}
            <div
              ref={topTextRef}
              className="relative z-10 order-1 md:order-2 md:col-span-3 flex flex-col justify-start"
              style={{gridRow: '1', gridColumn: '5 / 8'}}
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

              {/* Download CV button */}
              <div className="mt-10">
                <DownloadCvButton />
              </div>
            </div>

            {/* Row 2, Col 1-4: Text left */}
            <div
              ref={bottomTextRef}
              className="relative z-10 md:col-span-4 flex flex-col justify-start"
              style={{gridRow: '2', gridColumn: '1 / 5', marginTop: '6rem'}}
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

            {/* Row 1-2, Col 5-7: Image right — spans both rows for natural overlap */}
            <div
              ref={bottomImageRef}
              className="md:col-span-3 md:-mr-12 lg:-mr-20 overflow-hidden"
              style={{gridRow: '1 / 3', gridColumn: '5 / 8', alignSelf: 'end'}}
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
