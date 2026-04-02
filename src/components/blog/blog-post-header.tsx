import type {PostMeta} from '@/lib/blog';

interface BlogPostHeaderProps {
  meta: PostMeta;
  locale: string;
}

export function BlogPostHeader({meta, locale}: BlogPostHeaderProps) {
  const formattedDate = new Date(meta.date).toLocaleDateString(
    locale === 'vi' ? 'vi-VN' : 'en-US',
    {year: 'numeric', month: 'long', day: 'numeric'}
  );

  // Category labels: first 2 tags joined with " · "
  const categoryLabel = meta.tags.slice(0, 2).join(' \u00B7 ');

  // Reading time
  const readingTimeText = meta.readingTime
    ? locale === 'vi'
      ? `${meta.readingTime} ph\u00FAt \u0111\u1ECDc`
      : `${meta.readingTime} min read`
    : '';

  // Meta line: date · reading time
  const metaLine = [formattedDate, readingTimeText].filter(Boolean).join(' \u00B7 ');

  return (
    <header className="mb-12">
      {/* Category label */}
      {categoryLabel && (
        <span
          className="text-sm font-body font-medium uppercase tracking-[0.08em]"
          style={{color: 'var(--greige-500)'}}
        >
          {categoryLabel}
        </span>
      )}

      {/* Post title */}
      <h1
        className="mt-3 font-display"
        style={{
          fontSize: 'var(--text-display-sm)',
          fontWeight: 'var(--font-weight-display)',
          color: 'var(--greige-900)',
          lineHeight: 1.2,
        }}
      >
        {meta.title}
      </h1>

      {/* Meta line: date · reading time */}
      <p
        className="mt-4 text-sm font-body font-medium"
        style={{color: 'var(--greige-500)'}}
      >
        {metaLine}
      </p>

      {/* Cover image (full content-width) */}
      {meta.coverImage && (
        <div className="mt-8 overflow-hidden rounded-lg">
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="w-full object-cover"
            style={{aspectRatio: '16/9'}}
            loading="eager"
          />
        </div>
      )}
    </header>
  );
}
