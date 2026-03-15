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
      const { data } = matter(raw);
      return {
        slug: filename.replace('.mdx', ''),
        ...(data as Omit<PostMeta, 'slug'>),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string) {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<PostMeta, 'slug'>) }, content };
}

export function getSeriesPosts(locale: string, seriesName: string): PostMeta[] {
  return getAllPosts(locale)
    .filter((p) => p.series === seriesName)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}
