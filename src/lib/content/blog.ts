import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type BlogPostFrontmatter = {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  featured?: boolean;
  readTime: string;
  order: number;
};

export type BlogPost = BlogPostFrontmatter & {
  slug: string;
  content: string;
};

const blogContentDirectory = path.join(process.cwd(), 'src/content/blog');

function readPostFile(fileName: string): BlogPost {
  const filePath = path.join(blogContentDirectory, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const slug = fileName.replace(/\.md$/, '');

  const frontmatter = data as BlogPostFrontmatter & { date?: unknown };
  const rawDate = frontmatter.date;
  const normalizedDate =
    typeof rawDate === 'object' && rawDate !== null && 'toISOString' in rawDate
      ? (rawDate as Date).toISOString().slice(0, 10)
      : String(rawDate ?? '');

  return {
    slug,
    content,
    ...frontmatter,
    date: normalizedDate,
  };
}

export function getBlogPosts(): BlogPost[] {
  return fs
    .readdirSync(blogContentDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map(readPostFile)
    .sort((left, right) => left.order - right.order || right.date.localeCompare(left.date));
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getBlogPosts().filter((post) => post.featured);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}
