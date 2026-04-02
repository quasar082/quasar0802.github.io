import {projects} from '@/lib/data/projects';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {TextReveal} from '@/components/ui/text-reveal';
import {buildAlternates} from '@/lib/metadata';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return projects.flatMap((p) => [
    {lang: 'en', slug: p.slug},
    {lang: 'vi', slug: p.slug},
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string; slug: string}>;
}): Promise<Metadata> {
  const {lang, slug} = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = lang === 'vi' ? project.titleVi : project.title;
  const description =
    lang === 'vi' ? project.descriptionVi : project.description;
  return {
    title,
    description,
    alternates: buildAlternates(`projects/${slug}`),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{lang: string; slug: string}>;
}) {
  const {lang, slug} = await params;
  setRequestLocale(lang);

  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  const t = await getTranslations({locale: lang, namespace: 'Projects'});

  const title = lang === 'vi' ? project.titleVi : project.title;
  const description =
    lang === 'vi' ? project.descriptionVi : project.description;
  const challenge =
    lang === 'vi'
      ? project.caseStudy.challengeVi
      : project.caseStudy.challenge;
  const solution =
    lang === 'vi' ? project.caseStudy.solutionVi : project.caseStudy.solution;

  return (
    <div className="min-h-dvh px-6 py-section md:px-8">
      <div className="mx-auto max-w-[800px]">
        <Link
          href={`/${lang}/projects/`}
          className="mb-12 inline-block text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          &larr; {t('backToProjects')}
        </Link>

        <TextReveal
          as="h1"
          type="words"
          className="font-display text-text-primary"
          style={{
            fontSize: 'var(--text-display-sm)',
            fontWeight: 'var(--font-weight-display)',
          }}
        >
          {title}
        </TextReveal>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent-muted px-3 py-1 text-xs text-text-accent"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-8 text-pretty text-lg leading-relaxed text-text-secondary">
          {description}
        </p>

        <section className="mt-16">
          <TextReveal
            as="h2"
            type="words"
            className="font-display text-2xl text-text-primary"
            style={{fontWeight: 'var(--font-weight-display)'}}
          >
            {t('challenge')}
          </TextReveal>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-text-secondary">
            {challenge}
          </p>
        </section>

        <section className="mt-16">
          <TextReveal
            as="h2"
            type="words"
            className="font-display text-2xl text-text-primary"
            style={{fontWeight: 'var(--font-weight-display)'}}
          >
            {t('solution')}
          </TextReveal>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-text-secondary">
            {solution}
          </p>
        </section>

        {project.caseStudy.screenshots.length > 0 && (
          <div className="mt-16 space-y-6">
            {project.caseStudy.screenshots.map((src, i) => (
              <div
                key={src}
                className="overflow-hidden rounded-lg bg-surface-elevated"
              >
                <img
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-wrap gap-4">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm text-text-primary transition-colors hover:border-border-hover hover:bg-surface-elevated"
            >
              {t('liveDemo')}
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm text-text-primary transition-colors hover:border-border-hover hover:bg-surface-elevated"
            >
              {t('sourceCode')}
            </a>
          )}
          {project.links.paper && (
            <a
              href={project.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm text-text-primary transition-colors hover:border-border-hover hover:bg-surface-elevated"
            >
              Paper
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
