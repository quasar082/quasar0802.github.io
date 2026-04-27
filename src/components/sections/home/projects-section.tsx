import { CursorHoverCard } from '@/components/ui/cursor-hover-card';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import type { ProjectItem } from '@/lib/content/home';

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="box-border min-h-dvh bg-white px-4 py-10 text-black sm:px-6 lg:px-8" aria-label="Projects section">
      <div className="container mx-auto">
        <h2 className="m-0 max-w-full text-5xl leading-tight tracking-tight md:text-7xl lg:text-8xl">Projects</h2>

        <div className="mt-12 grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <CursorHoverCard key={project.name} label="View now" iconVariant="arrow-up-right" className="relative block">
              <article className="relative">
                <span className="pointer-events-none absolute -right-2 -top-4 z-10 text-5xl font-medium leading-none tracking-tight text-gray-500/75 md:-right-3 md:-top-6 md:text-6xl">#{index + 1}</span>
                <div
                  className={`aspect-[4/3] w-full bg-cover bg-center ${project.imageUrl ? '' : project.placeholderClass}`}
                  style={project.imageUrl ? { backgroundImage: `url('${project.imageUrl}')` } : undefined}
                  aria-hidden="true"
                />
                <a
                  href={project.href}
                  className="mt-4 inline-block text-base tracking-wide text-black no-underline transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  {project.name}
                </a>
              </article>
            </CursorHoverCard>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <a href="https://github.com/quasar082" target="_blank" rel="noopener noreferrer" aria-label="View more projects on GitHub">
            <InteractiveHoverButton>View More</InteractiveHoverButton>
          </a>
        </div>
      </div>
    </section>
  );
}
