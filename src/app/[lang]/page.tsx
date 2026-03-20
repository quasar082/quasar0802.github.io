import {HeroSection} from '@/components/hero/HeroSection';
import {AboutSection} from '@/components/about/AboutSection';
import {SvgDivider} from '@/components/animations/SvgDivider';
import {buildAlternates} from '@/lib/metadata';
import {personJsonLd, safeJsonLd} from '@/lib/jsonld';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>;
}): Promise<Metadata> {
  const {lang} = await params;
  const t = await getTranslations({locale: lang, namespace: 'Metadata'});
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{lang: string}>;
}) {
  const {lang} = await params;
  setRequestLocale(lang);

  return (
    <div className="min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: safeJsonLd(personJsonLd())}}
      />

      {/* Hero section */}
      <HeroSection />

      <SvgDivider />

      {/* About */}
      <div id="about">
        <AboutSection />
      </div>
    </div>
  );
}
