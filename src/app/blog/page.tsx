import type { Metadata } from 'next';
import { BlogPageClient } from '@/components/blog/blog-page-client';
import { BlogShell } from '@/components/blog/blog-shell';
import { getBlogCategories, getBlogPosts, getLatestBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on AI systems, product design, frontend architecture, and motion.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const latestPosts = getLatestBlogPosts(5);
  const categories = getBlogCategories();

  return (
    <BlogShell>
      <BlogPageClient latestPosts={latestPosts} posts={posts} categories={categories} />
    </BlogShell>
  );
}
