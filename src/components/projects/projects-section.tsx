import {getTranslations} from 'next-intl/server';
import {TextReveal} from '@/components/ui/text-reveal';
import {ProjectMasonryGrid} from '@/components/projects/project-masonry-grid';
import {TransitionLink} from '@/components/providers/transition-link';
import type {Project} from '@/lib/data/projects';

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
}

export async function ProjectsSection({
  projects,
  locale,
}: ProjectsSectionProps) {
  const t = await getTranslations('Projects');

  return (
    <section
      id="projects"
      className="px-6 py-section-sm md:px-8 md:py-section lg:px-12"
    >
      <div className="mx-auto max-w-screen-2xl">
        {/* Title */}
        <div className="text-center">
          <TextReveal
            as="h2"
            type="words"
            className="font-display uppercase tracking-[0.05em] text-text-primary"
            style={{
              fontSize: 'var(--text-display-md)',
              fontWeight: 'var(--font-weight-display)',
            }}
          >
            {t('heading')}
          </TextReveal>
          {/* Underline accent */}
          <div className="mx-auto mt-4 h-px w-10 bg-greige-500" />
        </div>

        {/* Masonry Grid */}
        <div className="mt-16 md:mt-24">
          <ProjectMasonryGrid projects={projects} locale={locale} />
        </div>

        {/* View More CTA */}
        <div className="mt-16 md:mt-24 text-center">
          <TransitionLink
            href="/projects"
            className="inline-block rounded-full border border-border px-8 py-3 text-sm uppercase tracking-wider text-text-primary transition-colors hover:border-border-hover hover:bg-surface-elevated"
            data-cursor-hover
          >
            {t('viewMore')}
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
