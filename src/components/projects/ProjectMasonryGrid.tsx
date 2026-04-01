import {ProjectCardParallax} from '@/components/projects/ProjectCardParallax';
import {ProjectCard} from '@/components/projects/ProjectCard';
import type {Project} from '@/data/projects';

interface ProjectMasonryGridProps {
  projects: Project[];
  locale: string;
}

export function ProjectMasonryGrid({projects, locale}: ProjectMasonryGridProps) {
  // Round-robin distribution across 3 columns
  const col1 = projects.filter((_, i) => i % 3 === 0);
  const col2 = projects.filter((_, i) => i % 3 === 1);
  const col3 = projects.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col gap-12 md:flex-row md:gap-8 lg:gap-12">
      {/* Column 1: no offset */}
      <div className="flex-1 flex flex-col gap-12 md:gap-16">
        {col1.map((project, colIdx) => {
          const globalIndex = colIdx * 3;
          return (
            <ProjectCardParallax key={project.slug} index={globalIndex}>
              <ProjectCard
                project={project}
                locale={locale}
                index={globalIndex}
              />
            </ProjectCardParallax>
          );
        })}
      </div>

      {/* Column 2: 80px offset on tablet+ */}
      <div className="flex-1 flex flex-col gap-12 md:gap-16 md:pt-[80px]">
        {col2.map((project, colIdx) => {
          const globalIndex = colIdx * 3 + 1;
          return (
            <ProjectCardParallax key={project.slug} index={globalIndex}>
              <ProjectCard
                project={project}
                locale={locale}
                index={globalIndex}
              />
            </ProjectCardParallax>
          );
        })}
      </div>

      {/* Column 3: 160px offset, hidden below lg */}
      <div className="hidden lg:flex flex-1 flex-col gap-16 lg:pt-[160px]">
        {col3.map((project, colIdx) => {
          const globalIndex = colIdx * 3 + 2;
          return (
            <ProjectCardParallax key={project.slug} index={globalIndex}>
              <ProjectCard
                project={project}
                locale={locale}
                index={globalIndex}
              />
            </ProjectCardParallax>
          );
        })}
      </div>
    </div>
  );
}
