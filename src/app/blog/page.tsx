import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/sections/home/site-header';
import { getBlogPosts, getFeaturedBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on AI systems, product design, frontend architecture, and motion.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const featuredPosts = getFeaturedBlogPosts();
  const latestPost = posts[0];

  return (
    <main className="min-h-dvh bg-[#f7f7f3] text-[#111111]">
      <SiteHeader isMenuOpen={false} isPastHero sticky={false} homeHref="/" />

      <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="container mx-auto border-b border-black/10 pb-10">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.18em] text-black/60">Quasar Journal</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end">
            <div>
              <h1 className="m-0 max-w-[11ch] text-[clamp(3.4rem,10vw,7.5rem)] leading-[0.92] tracking-tight">
                Thoughts on AI systems, product surfaces, and motion.
              </h1>
            </div>
            <p className="m-0 max-w-xl text-base leading-7 text-black/70 md:text-lg">
              A standalone blog inspired by modern editorial templates, adapted to fit this portfolio’s cleaner navigation and product-focused voice.
            </p>
          </div>
        </div>
      </section>

      {latestPost ? (
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <Link
              href={`/blog/${latestPost.slug}`}
              className="grid gap-6 rounded-[2rem] bg-[#111111] p-6 text-white no-underline transition-transform hover:-translate-y-0.5 md:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]"
            >
              <div>
                <p className="m-0 text-sm uppercase tracking-[0.18em] text-white/60">Latest article</p>
                <h2 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.94] tracking-tight">{latestPost.title}</h2>
              </div>
              <div className="flex flex-col justify-end gap-4">
                <p className="m-0 text-base leading-7 text-white/75">{latestPost.summary}</p>
                <p className="m-0 text-sm uppercase tracking-[0.12em] text-white/60">
                  {latestPost.date} · {latestPost.readTime}
                </p>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="m-0 text-3xl tracking-tight md:text-4xl">Featured posts</h2>
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.12em] text-black no-underline">
              Back home
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-[1.75rem] border border-black/10 bg-white p-6 text-inherit no-underline transition-transform hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3 className="mb-3 mt-6 text-3xl leading-tight tracking-tight">{post.title}</h3>
                <p className="m-0 text-base leading-7 text-black/70">{post.summary}</p>
                <p className="mb-0 mt-6 text-sm uppercase tracking-[0.12em] text-black/50">
                  {post.date} · {post.readTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="m-0 border-b border-black/10 pb-4 text-3xl tracking-tight md:text-4xl">All posts</h2>
          <div className="mt-6 grid gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="grid gap-4 rounded-[1.5rem] border border-transparent bg-white px-5 py-5 text-inherit no-underline transition-colors hover:border-black/10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:px-6"
              >
                <div>
                  <h3 className="m-0 text-2xl tracking-tight">{post.title}</h3>
                  <p className="mb-0 mt-3 max-w-3xl text-base leading-7 text-black/68">{post.summary}</p>
                </div>
                <div className="text-sm uppercase tracking-[0.12em] text-black/45 md:pt-1">
                  {post.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
