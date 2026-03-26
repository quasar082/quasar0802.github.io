import {HeroSection} from '@/components/hero/HeroSection';
import {MiniQuoteSection} from '@/components/about/MiniQuoteSection';
import {AboutSection} from '@/components/about/AboutSection';
import {AchievementsSection} from '@/components/achievements/AchievementsSection';
import {projects} from '@/data/projects';
import {ProjectGrid} from '@/components/projects/ProjectGrid';
import {TransitionLink} from '@/components/transitions/TransitionLink';

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
  const t = await getTranslations({locale: lang, namespace: 'Projects'});

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

      {/* Achievements */}
      <div id="achievements">
        <AchievementsSection />
      </div>

      {/* Projects */}
      <div id="projects">
        <ProjectGrid projects={projects.slice(0, 6)} locale={lang} />
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 pb-section text-center">
          <TransitionLink
            href="/projects"
            className="inline-block rounded-full border border-border px-8 py-3 text-sm uppercase tracking-wider text-text-primary transition-colors hover:border-border-hover hover:bg-surface-elevated"
          >
            {t('viewMore')}
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
