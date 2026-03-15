'use client';

import {useTranslations} from 'next-intl';
import {Marquee} from '@/components/hero/Marquee';

export function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden">
      {/* Photo placeholder */}
      <div className="relative z-10 h-[280px] w-[220px] rounded-lg bg-greige-200 md:h-[350px] md:w-[280px]" />

      {/* Role text */}
      <div className="relative z-10 mt-6 text-center">
        <p
          className="font-display font-[300] text-text-primary"
          style={{fontSize: 'var(--text-display-md)'}}
        >
          {t('role')}
        </p>
      </div>

      {/* Tagline */}
      <p className="relative z-10 mt-3 text-lg text-text-secondary md:text-xl">
        {t('tagline')}
      </p>

      {/* Marquee - positioned behind content at vertical center */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2">
        <Marquee />
      </div>
    </section>
  );
}
