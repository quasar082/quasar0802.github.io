'use client';

import {useRef} from 'react';
import {gsap, ScrollTrigger, useGSAP} from '@/lib/animations/gsap';
import {usePreloaderDone} from '@/lib/hooks/use-preloader-done';

interface ProjectCardParallaxProps {
  index: number;
  children: React.ReactNode;
}

export function ProjectCardParallax({index, children}: ProjectCardParallaxProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  useGSAP(
    () => {
      if (!cardRef.current || !preloaderDone) return;

      const card = cardRef.current;
      const imageEl = card.querySelector('[data-parallax-image]');
      const textEl = card.querySelector('[data-parallax-text]');

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        // Instant visibility, no animations
        gsap.set(card, {opacity: 1});
        return;
      }

      // Card entrance animation
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });

      // Skip parallax on mobile (<768px)
      const isMobile = window.innerWidth < 768;
      if (isMobile) return;

      // Image parallax — slower scrub for more depth
      if (imageEl) {
        gsap.fromTo(
          imageEl,
          {yPercent: -8},
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          },
        );
      }

      // Text parallax — faster scrub for subtle movement
      if (textEl) {
        gsap.fromTo(
          textEl,
          {yPercent: -5},
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      }
    },
    {scope: cardRef, dependencies: [preloaderDone]},
  );

  return (
    <div ref={cardRef} style={{willChange: 'transform'}}>
      {children}
    </div>
  );
}
