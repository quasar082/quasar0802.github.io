'use client';

import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/sections/home/site-header';
import { BlogMenuOverlay } from './blog-menu-overlay';

type BlogShellProps = {
  children: React.ReactNode;
  activeHref?: string;
};

const blogMenuItems = [
  { label: 'Hero', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Project', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export function BlogShell({ children, activeHref = '/blog' }: BlogShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const menuItems = useMemo(() => blogMenuItems, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const nearTop = currentScrollY <= 16;

      setIsHeaderVisible(nearTop || scrollingUp || isMenuOpen);
      lastScrollY = currentScrollY;
    };

    updateHeaderVisibility();
    window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderVisibility);
    };
  }, [isMenuOpen]);

  return (
    <main className="min-h-dvh bg-[#f7f7f3] text-[#111111]">
      <SiteHeader isMenuOpen={isMenuOpen} isPastHero isVisible={isHeaderVisible} onOpenMenu={() => setIsMenuOpen((open) => !open)} sticky homeHref="/" />
      {children}
      <BlogMenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} activeHref={activeHref} />
    </main>
  );
}
