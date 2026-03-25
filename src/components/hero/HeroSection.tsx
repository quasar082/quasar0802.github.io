'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, ScrollTrigger, useGSAP} from '@/lib/gsap';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';

export function HeroSection() {
  const t = useTranslations('Hero');
  const heroRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // --- Entrance animations (gated on preloader) ---
  useGSAP(
    () => {
      if (!preloaderDone) return;

      // Set initial states
      gsap.set(
        [
          photoRef.current,
          titleRef.current,
          subtitleRef.current,
          scrollIndicatorRef.current,
        ],
        {opacity: 0}
      );
      gsap.set(photoRef.current, {scale: 1.08, filter: 'blur(6px)'});
      gsap.set(titleRef.current, {filter: 'blur(6px)'});
      gsap.set(subtitleRef.current, {filter: 'blur(6px)'});

      // Create entrance timeline
      const tl = gsap.timeline();

      // 1. Photo: scale down + deblur
      tl.to(photoRef.current, {
        scale: 1,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      });

      // 2. Title: deblur + fade in
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.95'
      );

      // 3. Subtitle: deblur + fade in
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.75'
      );

      // 4. Scroll indicator: fade in
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.75'
      );

      // 5. After entrance completes, add CSS pulse class
      tl.call(() => {
        scrollIndicatorRef.current?.classList.add('scroll-indicator-pulse');
      });
    },
    {scope: heroRef, dependencies: [preloaderDone]}
  );

  // --- Scroll-driven effects ---
  useGSAP(
    () => {
      if (!preloaderDone) return;

      // Photo parallax + fade (bidirectional via fromTo)
      gsap.fromTo(
        photoRef.current,
        {yPercent: 0, opacity: 1},
        {
          yPercent: -15,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Text block fade + slide up — text scrolls faster than photo
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        {yPercent: 0, opacity: 1},
        {
          yPercent: -50,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        }
      );

      // Scroll indicator early fade (bidirectional via fromTo)
      gsap.fromTo(
        scrollIndicatorRef.current,
        {opacity: 1},
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '30% top',
            scrub: true,
          },
        }
      );
    },
    {scope: heroRef, dependencies: [preloaderDone]}
  );

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] -mt-20 overflow-hidden"
    >
      {/* Centered photo */}
      <div
        ref={photoRef}
        className="absolute inset-0 flex items-end justify-center"
      >
        <img
          src="/images/hero-sazabi.png"
          alt={t('imageAlt')}
          className="h-[70vh] min-w-[280px] w-auto object-contain md:h-[75vh] lg:h-[80vh]"
          loading="eager"
          fetchPriority="high"
        />

        {/* Edge gradients — follow photo parallax */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] z-[1]"
          style={{
            background:
              'linear-gradient(to top, var(--warm-white) 10%, transparent 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[15%] z-[1]"
          style={{
            background:
              'linear-gradient(to bottom, var(--warm-white) 1%, transparent 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[10%] z-[1]"
          style={{
            background:
              'linear-gradient(to right, var(--warm-white) 1%, transparent 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[10%] z-[1]"
          style={{
            background:
              'linear-gradient(to left, var(--warm-white) 1%, transparent 100%)',
          }}
        />
      </div>

      {/* Text block: bottom-left */}
      <div className="absolute bottom-[30%] left-6 z-10 md:left-12 lg:left-20">
        <h1
          ref={titleRef}
          className="font-display text-2xl text-text-primary md:text-[1.625rem]"
        >
          {t('title')}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-0.5 font-body text-lg text-text-secondary md:text-xl"
        >
          {t('subtitle')}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-6 z-10 md:left-12 lg:left-20"
      >
        <span className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
          {t('scroll')}
        </span>
      </div>
    </section>
  );
}
