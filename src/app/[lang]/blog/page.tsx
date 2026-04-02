import {getAllPosts, getFeaturedPosts} from '@/lib/blog';
import {FeaturedSlider} from '@/components/blog/featured-slider';
import {BlogGrid} from '@/components/blog/blog-grid';
import {TextReveal} from '@/components/ui/text-reveal';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {buildAlternates} from '@/lib/metadata';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return [{lang: 'en'}, {lang: 'vi'}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>;
}): Promise<Metadata> {
  const {lang} = await params;
  const t = await getTranslations({locale: lang, namespace: 'Blog'});
  return {
    title: 'Blog',
    description: t('description'),
    alternates: buildAlternates('blog'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{lang: string}>;
}) {
  const {lang} = await params;
  setRequestLocale(lang);

  const allPosts = getAllPosts(lang);
  const featuredPosts = getFeaturedPosts(lang);

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-screen-2xl px-6 pt-32 pb-20 md:px-8 lg:px-12">
        {/* Featured section */}
        <TextReveal
          as="h1"
          type="words"
          className="font-display"
          style={{
            fontSize: 'var(--text-display-lg)',
            fontWeight: 'var(--font-weight-display)',
            color: 'var(--greige-900)',
          }}
        >
          {(await getTranslations({locale: lang, namespace: 'Blog'}))('ourLatest')}
        </TextReveal>

        <div className="mt-10">
          <FeaturedSlider posts={featuredPosts} locale={lang} />
        </div>

        {/* All posts grid section — 48px gap from slider */}
        <div className="mt-12">
          <BlogGrid posts={allPosts} locale={lang} />
        </div>
      </div>
    </div>
  );
}
