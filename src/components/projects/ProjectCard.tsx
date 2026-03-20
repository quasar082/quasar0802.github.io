import Link from 'next/link';
import type {Project} from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export function ProjectCard({project, locale}: ProjectCardProps) {
  const title = locale === 'vi' ? project.titleVi : project.title;
  const description =
    locale === 'vi' ? project.descriptionVi : project.description;

  return (
    <Link
      href={`/${locale}/projects/${project.slug}/`}
      className="group block overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md"
    >
      <div className="aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={project.thumbnail}
          alt={title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-balance font-display text-xl font-medium text-text-primary">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent-muted px-3 py-1 text-xs text-text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
