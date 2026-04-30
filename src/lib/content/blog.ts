import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type BlogPostFrontmatter = {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  category: string;
  coverImage: string;
  featured?: boolean;
  readTime: string;
  order: number;
};

export type BlogPost = BlogPostFrontmatter & {
  slug: string;
  content: string;
};

const blogContentDirectory = path.join(process.cwd(), 'content/blog');

function normalizeDate(rawDate: unknown) {
  if (typeof rawDate === 'object' && rawDate !== null && 'toISOString' in rawDate) {
    return (rawDate as Date).toISOString().slice(0, 10);
  }

  return String(rawDate ?? '');
}

function readPostFile(fileName: string): BlogPost {
  const filePath = path.join(blogContentDirectory, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const slug = fileName.replace(/\.mdx$/, '');
  const frontmatter = data as BlogPostFrontmatter & { date?: unknown };

  return {
    slug,
    content,
    ...frontmatter,
    date: normalizeDate(frontmatter.date),
  };
}

export function getBlogPosts(): BlogPost[] {
  return fs
    .readdirSync(blogContentDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map(readPostFile)
    .sort((left, right) => right.date.localeCompare(left.date) || left.order - right.order);
}

export function getFeaturedBlogPosts(limit?: number): BlogPost[] {
  const featuredPosts = getBlogPosts().filter((post) => post.featured);

  return typeof limit === 'number' ? featuredPosts.slice(0, limit) : featuredPosts;
}

export function getLatestBlogPosts(limit = 5): BlogPost[] {
  return getBlogPosts().slice(0, limit);
}

export function getBlogCategories(): string[] {
  return Array.from(new Set(getBlogPosts().map((post) => post.category)));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}
