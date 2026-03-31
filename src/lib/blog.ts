import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  series?: string;
  seriesOrder?: number;
  featured?: boolean;     // marks post for featured slider
  coverImage?: string;    // path relative to public/ directory
  bottomText?: string;    // optional text below cover image
  readingTime?: number;   // calculated from word count
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: filename.replace('.mdx', ''),
        ...(data as Omit<PostMeta, 'slug' | 'readingTime'>),
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string) {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      ...(data as Omit<PostMeta, 'slug' | 'readingTime'>),
      readingTime: calculateReadingTime(content),
    },
    content,
  };
}

export function getSeriesPosts(locale: string, seriesName: string): PostMeta[] {
  return getAllPosts(locale)
    .filter((p) => p.series === seriesName)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export function getFeaturedPosts(locale: string): PostMeta[] {
  const all = getAllPosts(locale);
  const featured = all.filter((p) => p.featured);
  if (featured.length >= 3) return featured;
  // Fallback: use most recent posts
  return all.slice(0, Math.max(3, featured.length));
}
