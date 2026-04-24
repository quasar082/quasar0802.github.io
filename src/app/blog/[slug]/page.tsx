import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogMdx } from '@/components/blog/blog-mdx';
import { BlogShell } from '@/components/blog/blog-shell';
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
    <BlogShell>
      <article className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.12em] text-black/60 no-underline">
            Back to blog
          </Link>
          <div className="mt-6 border-b border-black/10 pb-8">
            <div className="aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-[#ebebe4]">
              <Image src={post.coverImage} alt="" width={1600} height={900} className="h-full w-full object-cover" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/50">
              <span>{post.category}</span>
              <span>•</span>
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

          <div className="mt-10 max-w-none">
            <BlogMdx source={post.content} />
          </div>
        </div>
      </article>
    </BlogShell>
  );
}
