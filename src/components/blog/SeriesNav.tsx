'use client';

import Link from 'next/link';
import type {PostMeta} from '@/lib/blog';
import {useTranslations} from 'next-intl';

interface SeriesNavProps {
  seriesPosts: PostMeta[];
  currentSlug: string;
  locale: string;
  seriesName: string;
}

export function SeriesNav({
  seriesPosts,
  currentSlug,
  locale,
  seriesName,
}: SeriesNavProps) {
  const t = useTranslations('Blog');
  const currentIndex = seriesPosts.findIndex((p) => p.slug === currentSlug);
  const prev = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const next =
    currentIndex < seriesPosts.length - 1
      ? seriesPosts[currentIndex + 1]
      : null;

  return (
    <div className="mt-16 rounded-lg border border-border bg-surface-elevated p-6">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">
        {t('series')}: {seriesName}
      </h3>

      <ol className="space-y-2">
        {seriesPosts.map((post, i) => (
          <li key={post.slug}>
            {post.slug === currentSlug ? (
              <span className="text-sm font-medium text-text-primary">
                {i + 1}. {post.title}
              </span>
            ) : (
              <Link
                href={`/${locale}/blog/${post.slug}/`}
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {i + 1}. {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        {prev ? (
          <Link
            href={`/${locale}/blog/${prev.slug}/`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            &larr; {t('previousPart')}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${locale}/blog/${next.slug}/`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            {t('nextPart')} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
