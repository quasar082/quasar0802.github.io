import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ServiceItem = {
  label: string;
  href: string;
  previewImageUrl?: string;
  order: number;
};

export type MenuItem = {
  label: string;
  href: string;
  order: number;
};

export type ProjectItem = {
  name: string;
  href: string;
  placeholderClass: string;
  imageUrl?: string;
  order: number;
};

export type ExperienceItem = {
  date: string;
  role: string;
  details: string;
  previewImageUrl?: string;
  order: number;
};

export type ContactSocial = {
  label: string;
  href: string;
  order: number;
};

export type HomeContent = {
  heroImagePath: string;
  services: ServiceItem[];
  menuItems: MenuItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  contactSocials: ContactSocial[];
};

type OrderedItem = {
  order: number;
};

const homeContentDirectory = path.join(process.cwd(), 'src/content/home');

function readMarkdownFrontmatter<T>(filePath: string): T {
  const source = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(source);

  return data as T;
}

function readCollection<T extends OrderedItem>(directoryName: string): T[] {
  const directory = path.join(homeContentDirectory, directoryName);

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      fileName,
      data: readMarkdownFrontmatter<T>(path.join(directory, fileName)),
    }))
    .sort((left, right) => left.data.order - right.data.order || left.fileName.localeCompare(right.fileName))
    .map((entry) => entry.data);
}

export function getHomeContent(): HomeContent {
  const site = readMarkdownFrontmatter<{ heroImagePath: string }>(path.join(homeContentDirectory, 'site.md'));

  return {
    heroImagePath: site.heroImagePath,
    services: readCollection<ServiceItem>('services'),
    menuItems: readCollection<MenuItem>('menu-items'),
    projects: readCollection<ProjectItem>('projects'),
    experiences: readCollection<ExperienceItem>('achievements'),
    contactSocials: readCollection<ContactSocial>('contact-socials'),
  };
}
