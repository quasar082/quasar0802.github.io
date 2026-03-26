'use client';

import {useTranslations} from 'next-intl';
import {TextReveal} from '@/components/animations/TextReveal';

export function MiniQuoteSection() {
  const t = useTranslations('About');

  return (
    <section
      className="flex items-center justify-center px-6 md:px-8 lg:px-12"
      style={{
        paddingTop: '10rem',
        paddingBottom: '10rem',
      }}
    >
      <div className="mx-auto max-w-screen-2xl text-center">
        <TextReveal
          as="p"
          type="words"
          stagger={0.04}
          className="font-body text-text-secondary"
          style={{
            fontSize: 'var(--text-lg)',
            lineHeight: '1.7',
          }}
        >
          {t('quote')}
        </TextReveal>
      </div>
    </section>
  );
}
