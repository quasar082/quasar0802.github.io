import {getTranslations} from 'next-intl/server';
import {TextReveal} from '@/components/animations/TextReveal';
import {SectionNumber} from '@/components/animations/SectionNumber';

export async function AboutSection() {
  const t = await getTranslations('About');

  return (
    <section className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-[800px]">
        <div className="mb-4">
          <SectionNumber number="02" />
        </div>
        <TextReveal
          as="h2"
          type="words"
          className="font-display text-text-primary"
          style={{
            fontSize: 'var(--text-display-md)',
            fontWeight: 'var(--font-weight-display)',
          }}
        >
          {t('heading')}
        </TextReveal>
        <div className="mt-12 space-y-6">
          <TextReveal
            as="p"
            type="lines"
            stagger={0.05}
            className="text-lg leading-relaxed text-text-secondary"
          >
            {t('story1')}
          </TextReveal>
          <TextReveal
            as="p"
            type="lines"
            stagger={0.05}
            className="text-lg leading-relaxed text-text-secondary"
          >
            {t('story2')}
          </TextReveal>
          <TextReveal
            as="p"
            type="lines"
            stagger={0.05}
            className="text-lg leading-relaxed text-text-secondary"
          >
            {t('expertise')}
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
