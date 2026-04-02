import {compileMDX} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import {getPostBySlug, getAllPosts, getSeriesPosts} from '@/lib/blog';
import {mdxComponents} from '@/components/blog/mdx';
import {TableOfContents} from '@/components/blog/table-of-contents';
import {SeriesNav} from '@/components/blog/series-nav';
import {BlogPostHeader} from '@/components/blog/blog-post-header';
import {notFound} from 'next/navigation';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import Link from 'next/link';
import {buildAlternates, defaultOgImage} from '@/lib/metadata';
import {articleJsonLd, safeJsonLd} from '@/lib/jsonld';
import type {Metadata} from 'next';

export function generateStaticParams() {
  const enPosts = getAllPosts('en');
  const viPosts = getAllPosts('vi');
  return [
    ...enPosts.map((p) => ({lang: 'en', slug: p.slug})),
    ...viPosts.map((p) => ({lang: 'vi', slug: p.slug})),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string; slug: string}>;
}): Promise<Metadata> {
  const {lang, slug} = await params;
  let post;
  try {
    post = getPostBySlug(lang, slug);
  } catch {
    return {};
  }
  const {meta} = post;
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: meta.date,
      images: defaultOgImage,
    },
    alternates: buildAlternates(`blog/${slug}`),
  };
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: {level: number; text: string; id: string}[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    headings.push({
      level: match[1].length,
      text,
      id: text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    });
  }
  return headings;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{lang: string; slug: string}>;
}) {
  const {lang, slug} = await params;
  setRequestLocale(lang);

  let post;
  try {
    post = getPostBySlug(lang, slug);
  } catch {
    notFound();
  }

  const {meta, content} = post;
  const t = await getTranslations({locale: lang, namespace: 'Blog'});

  const {content: mdxContent} = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, {theme: 'github-light'}],
        ],
      },
    },
  });

  const headings = extractHeadings(content);

  const seriesPosts =
    meta.series ? getSeriesPosts(lang, meta.series) : [];

  return (
    <div className="min-h-dvh px-6 pt-32 pb-20 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            articleJsonLd({
              title: meta.title,
              date: meta.date,
              excerpt: meta.excerpt,
              slug,
              lang,
              tags: meta.tags,
            }),
          ),
        }}
      />
      <div className="mx-auto max-w-[1100px]">
        <Link
          href={`/${lang}/blog/`}
          className="mb-12 inline-block text-sm font-body font-medium transition-colors"
          style={{color: 'var(--greige-500)'}}
        >
          &larr; {t('backToBlog')}
        </Link>

        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          {/* Main content */}
          <article className="min-w-0">
            {/* New post header with category, title, meta, cover image */}
            <BlogPostHeader meta={meta} locale={lang} />

            {/* Mobile TOC (inline, collapsible) */}
            <div className="lg:hidden">
              <TableOfContents headings={headings} />
            </div>

            {/* MDX content */}
            <div className="prose-custom">{mdxContent}</div>

            {/* Series navigation */}
            {seriesPosts.length > 1 && meta.series && (
              <SeriesNav
                seriesPosts={seriesPosts}
                currentSlug={slug}
                locale={lang}
                seriesName={meta.series}
              />
            )}
          </article>

          {/* Desktop sidebar: TOC */}
          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
