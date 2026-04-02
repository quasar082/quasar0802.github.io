import {projects} from '@/lib/data/projects';
import {ProjectGrid} from '@/components/projects/project-grid';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {buildAlternates} from '@/lib/metadata';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return [{lang: 'en'}, {lang: 'vi'}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>;
}): Promise<Metadata> {
  const {lang} = await params;
  const t = await getTranslations({locale: lang, namespace: 'Projects'});
  return {
    title: 'Projects',
    description: t('description'),
    alternates: buildAlternates('projects'),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{lang: string}>;
}) {
  const {lang} = await params;
  setRequestLocale(lang);

  return (
    <div className="min-h-dvh">
      <ProjectGrid projects={projects} locale={lang} />
    </div>
  );
}
