'use client';

import {useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/animations/gsap';
import {usePreloaderDone} from '@/lib/hooks/use-preloader-done';
import {TextReveal} from '@/components/ui/text-reveal';

const services = [
  {titleKey: 'service1Title', bodyKey: 'service1Body', num: '01'},
  {titleKey: 'service2Title', bodyKey: 'service2Body', num: '02'},
  {titleKey: 'service3Title', bodyKey: 'service3Body', num: '03'},
] as const;

export function ServicesBlock() {
  const t = useTranslations('About');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preloaderDone = usePreloaderDone();

  // Stagger entrance for service columns
  useGSAP(
    () => {
      if (!preloaderDone) return;
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      gsap.from(cards, {
        opacity: 0,
        y: 40,
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
      {/* Services Title — centered, large */}
      <div className="mb-20 text-center">
        <TextReveal
          as="h3"
          type="words"
          stagger={0.04}
          className="font-display text-text-primary"
          style={{
            fontSize: 'var(--text-display-xl)',
            fontWeight: 'var(--font-weight-display)',
            lineHeight: '1.1',
          }}
        >
          {'I can\nhelp you with...'}
        </TextReveal>
      </div>

      {/* Service Cards — 3x4cols with 2-col gaps on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr_4fr_2fr_4fr] gap-y-12">
        {services.map((service, i) => (
          <div
            key={service.titleKey}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={i === 0 ? 'md:[grid-column:1]' : i === 1 ? 'md:[grid-column:3]' : 'md:[grid-column:5]'}
          >
            {/* Number */}
            <span
              className="block font-body text-text-muted mb-4"
              style={{fontSize: 'var(--text-sm)'}}
            >
              {service.num}
            </span>

            {/* Divider line */}
            <div className="w-full h-px mb-10" style={{backgroundColor: 'var(--greige-300)'}} />

            {/* Service title */}
            <h4
              className="font-display text-text-primary mb-6"
              style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-display)',
                lineHeight: '1.2',
              }}
            >
              {t(service.titleKey)}
            </h4>

            {/* Service body — single paragraph, no line breaks */}
            <p
              className="font-body text-text-secondary"
              style={{fontSize: 'var(--text-lg)', lineHeight: '1.7'}}
              dangerouslySetInnerHTML={{__html: t(service.bodyKey).replace(/\n/g, ' ')}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
