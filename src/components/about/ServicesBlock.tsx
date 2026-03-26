'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/gsap';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';
import {TextReveal} from '@/components/animations/TextReveal';

const services = [
  {titleKey: 'service1Title', bodyKey: 'service1Body'},
  {titleKey: 'service2Title', bodyKey: 'service2Body'},
  {titleKey: 'service3Title', bodyKey: 'service3Body'},
] as const;

export function ServicesBlock() {
  const t = useTranslations('About');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preloaderDone = usePreloaderDone();

  // Stagger entrance for service columns (Claude's discretion per UI-SPEC)
  useGSAP(
    () => {
      if (!preloaderDone) return;
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        filter: 'blur(4px)',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    {scope: containerRef, dependencies: [preloaderDone]},
  );

  return (
    <div ref={containerRef}>
      {/* Services Title */}
      <div className="mb-20 text-center">
        <TextReveal
          as="h3"
          type="words"
          stagger={0.04}
          className="font-display text-text-primary"
          style={{
            fontSize: 'var(--text-display-md)',
            fontWeight: 'var(--font-weight-display)',
            lineHeight: '1.2',
          }}
        >
          {t('servicesTitle')}
        </TextReveal>
      </div>

      {/* Service Cards -- zigzag layout (D-27) */}
      <div className="flex flex-col gap-16">
        {services.map((service, i) => (
          <div
            key={service.titleKey}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="w-[90%]"
            style={{
              marginLeft: i % 2 === 1 ? 'auto' : '0',
            }}
          >
            {/* Service title */}
            <h4
              className="font-display text-text-primary"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-display)',
                lineHeight: '1.3',
              }}
            >
              {t(service.titleKey)}
            </h4>
            {/* Service body */}
            <p
              className="mt-6 font-body text-text-secondary"
              style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
            >
              {t(service.bodyKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
