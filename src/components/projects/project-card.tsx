import Link from 'next/link';
import {WaterRippleImage} from '@/components/ui/water-ripple-image';
import type {Project} from '@/lib/data/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
  index: number;
}

export function ProjectCard({project, locale, index}: ProjectCardProps) {
  const title = locale === 'vi' ? project.titleVi : project.title;

  return (
    <Link
      href={`/${locale}/projects/${project.slug}/`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-greige-500"

    >
      {/* Image — 3:4 portrait, borderless editorial */}
      <div className="aspect-[3/4] overflow-hidden" data-parallax-image>
        <WaterRippleImage
          src={project.thumbnail}
          alt={title}
          className="size-full object-cover"
          aspectRatio="3/4"
          loading="lazy"
        />
      </div>

      {/* Text block — name left, number right */}
      <div
        className="mt-4 flex items-start justify-between"
        data-parallax-text
      >
        {/* Project name */}
        <h3 className="font-body text-sm uppercase tracking-[0.1em] text-text-primary line-clamp-2">
          {title}
        </h3>

        {/* Number */}
        <span
          className="ml-4 shrink-0 font-display text-text-muted"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-weight-display)',
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </Link>
  );
}
