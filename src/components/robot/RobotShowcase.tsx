'use client';

import {useRef, useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {RobotCanvas} from '@/components/robot/RobotCanvas';
import {SectionNumber} from '@/components/animations/SectionNumber';

export function RobotShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations('RobotShowcase');
  const [shouldLoad, setShouldLoad] = useState(false);

  // Defer 3D model loading until section nears viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {rootMargin: '200px'},
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.from(sectionRef.current!, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    {scope: sectionRef},
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6"
    >
      <div className="mb-4 text-center">
        <SectionNumber number="01" />
      </div>
      <h2
        className="text-center font-display text-text-primary"
        style={{
          fontSize: 'var(--text-display-sm)',
          fontWeight: 'var(--font-weight-display)',
        }}
      >
        {t('heading')}
      </h2>
      <p className="mt-3 text-center text-lg text-text-secondary">
        {t('cta')}
      </p>
      {shouldLoad ? (
        <RobotCanvas />
      ) : (
        <div className="relative h-[400px] w-full md:h-[600px]" />
      )}
    </section>
  );
}
