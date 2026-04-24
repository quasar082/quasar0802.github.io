'use client';

import { useMemo, useState } from 'react';
import { SiteHeader } from '@/components/sections/home/site-header';
import { BlogMenuOverlay } from './blog-menu-overlay';

type BlogShellProps = {
  children: React.ReactNode;
};

const blogMenuItems = [
  { label: 'Hero', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Project', href: '/#projects' },
  { label: 'Achievements', href: '/#achievements' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export function BlogShell({ children }: BlogShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = useMemo(() => blogMenuItems, []);

  return (
    <main className="min-h-dvh bg-[#f7f7f3] text-[#111111]">
      <SiteHeader isMenuOpen={isMenuOpen} isPastHero onOpenMenu={() => setIsMenuOpen((open) => !open)} sticky={false} homeHref="/" />
      {children}
      <BlogMenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} />
    </main>
  );
}
