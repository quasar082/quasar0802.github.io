import {getTranslations} from 'next-intl/server';
import {TextReveal} from '@/components/animations/TextReveal';
import {ProjectCard} from '@/components/projects/ProjectCard';
import type {Project} from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  locale: string;
}

export async function ProjectGrid({projects, locale}: ProjectGridProps) {
  const t = await getTranslations('Projects');

  return (
    <section className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-screen-2xl">
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
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
