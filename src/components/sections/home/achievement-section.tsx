import { CursorHoverImage } from '@/components/ui/cursor-hover-image';
import type { AchievementItem } from '@/lib/content/home';

type AchievementSectionProps = {
  achievements: AchievementItem[];
};

const achievementPreviewMap: Record<string, string> = {
  'AI Engineer': '/images/about.jpg',
};

export function AchievementSection({ achievements }: AchievementSectionProps) {
  return (
    <section id="achievements" className="box-border min-h-dvh bg-white px-4 py-10 text-black sm:px-6 lg:px-8" aria-label="Achievements section">
      <div className="container mx-auto">
        <h2 className="m-0 text-5xl leading-tight tracking-tight md:text-7xl lg:text-8xl">Achievements</h2>

        <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
          {achievements.map((achievement) => (
            <CursorHoverImage
              key={`${achievement.date}-${achievement.role}`}
              src={achievementPreviewMap[achievement.role] ?? '/images/projects.jpg'}
              width={320}
              height={210}
              className="block"
            >
              <article className="grid grid-cols-1 gap-4 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
                <p className="m-0 text-base font-medium tracking-wide text-black/80 md:text-lg">{achievement.date}</p>
                <h3 className="m-0 text-xl font-medium leading-tight text-black md:text-2xl">{achievement.role}</h3>
                <p className="m-0 text-sm leading-relaxed text-black/45 md:text-base">{achievement.details}</p>
              </article>
            </CursorHoverImage>
          ))}
        </div>
      </div>
    </section>
  );
}
