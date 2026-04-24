import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/sections/home/site-header';
import { getBlogPost, getBlogPosts } from '@/lib/content/blog';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-white text-[#111111]">
      <SiteHeader isMenuOpen={false} isPastHero sticky={false} homeHref="/" />

      <article className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.12em] text-black/60 no-underline">
            Back to blog
          </Link>
          <div className="mt-6 border-b border-black/10 pb-8">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/50">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h1 className="mb-0 mt-4 text-[clamp(3rem,8vw,5.5rem)] leading-[0.94] tracking-tight">{post.title}</h1>
            <p className="mb-0 mt-5 max-w-2xl text-lg leading-8 text-black/70">{post.summary}</p>
            <p className="mb-0 mt-6 text-sm uppercase tracking-[0.12em] text-black/45">
              {post.date} · {post.readTime}
            </p>
          </div>

          <div className="prose prose-neutral mt-10 max-w-none">
            {post.content
              .split('\n\n')
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph} className="m-0 mb-6 text-lg leading-8 text-black/78 last:mb-0">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </article>
    </main>
  );
}
