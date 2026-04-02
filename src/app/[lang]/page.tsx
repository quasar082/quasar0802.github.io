import {HeroSection} from '@/components/hero/hero-section';
import {MiniQuoteSection} from '@/components/about/mini-quote-section';
import {AboutSection} from '@/components/about/about-section';
import {AchievementsSection} from '@/components/achievements/achievements-section';
import {projects} from '@/lib/data/projects';
import {ProjectsSection} from '@/components/projects/projects-section';

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

      {/* Mini quote interstitial */}
      <MiniQuoteSection />

      {/* About */}
      <div id="about">
        <AboutSection />
      </div>

      {/* Mini quote 2 — after about */}
      <MiniQuoteSection quoteKey="quote2" />

      {/* Achievements */}
      <div id="achievements">
        <AchievementsSection />
      </div>

      {/* Projects */}
      <ProjectsSection projects={projects.slice(0, 6)} locale={lang} />
    </div>
  );
}
