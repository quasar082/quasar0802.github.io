import {getTranslations} from 'next-intl/server';
import {getLocale} from 'next-intl/server';
import {TextReveal} from '@/components/ui/text-reveal';
import {SectionNumber} from '@/components/ui/section-number';
import {TimelineEntry} from './timeline-entry';
import {achievements, CATEGORY_ORDER} from '@/lib/data/achievements';

export async function AchievementsSection() {
  const t = await getTranslations('Achievements');
  const locale = await getLocale();

  const grouped = CATEGORY_ORDER.map(cat => ({
    key: cat,
    label: t(cat),
    entries: achievements.filter(a => a.category === cat),
  }));

  let entryIndex = 0;

  return (
    <section className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-[800px]">
        <div className="mb-4">
          <SectionNumber number="03" />
        </div>
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

        <div className="mt-12 space-y-12">
          {grouped.map(group => {
            if (group.entries.length === 0) return null;
            return (
              <div key={group.key}>
                <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-text-muted">
                  {group.label}
                </h3>
                <div className="space-y-6">
                  {group.entries.map(achievement => {
                    const currentIndex = entryIndex++;
                    const title =
                      locale === 'vi' ? achievement.titleVi : achievement.title;
                    const org =
                      locale === 'vi'
                        ? achievement.organizationVi
                        : achievement.organization;
                    const desc = achievement.description
                      ? locale === 'vi'
                        ? achievement.descriptionVi
                        : achievement.description
                      : null;

                    return (
                      <TimelineEntry key={achievement.id} index={currentIndex}>
                        <div className="border-l-2 border-border pl-4">
                          <span className="font-mono text-sm text-text-muted">
                            {achievement.year}
                          </span>
                          <h4 className="mt-1 font-display text-xl text-text-primary">
                            {title}
                          </h4>
                          <p className="mt-1 text-base text-text-secondary">
                            {org}
                          </p>
                          {desc && (
                            <p className="mt-2 text-base leading-relaxed text-text-secondary">
                              {desc}
                            </p>
                          )}
                        </div>
                      </TimelineEntry>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
