'use client';

import { useEffect, useState } from 'react';
import type { HomeContent } from '@/lib/content/home';
import { AboutSection } from './about-section';
import { AchievementSection } from './achievement-section';
import { ContactSection } from './contact-section';
import { HeroSection } from './hero-section';
import { MenuOverlay } from './menu-overlay';
import { ProjectsSection } from './projects-section';
import { SiteHeader } from './site-header';

type HomePageClientProps = {
  content: HomeContent;
};

export function HomePageClient({ content }: HomePageClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(content.menuItems[0]?.href ?? '#home');
  const [isPastHero, setIsPastHero] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById('home');
    const sectionIds = content.menuItems.filter((item) => item.href.startsWith('#')).map((item) => item.href.slice(1));

    const updateScrollState = () => {
      setIsPastHero(hero ? hero.getBoundingClientRect().bottom <= 72 : false);

      const currentSectionId = sectionIds.findLast((sectionId) => {
        const section = document.getElementById(sectionId);

        return section ? section.getBoundingClientRect().top <= window.innerHeight * 0.35 : false;
      });

      if (currentSectionId) {
        setActiveSection(`#${currentSectionId}`);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [content.menuItems]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const nearTop = currentScrollY <= 16;

      const inContactSection = activeSection === '#contact';
      setIsHeaderVisible(nearTop || scrollingUp || isMenuOpen || inContactSection);
      lastScrollY = currentScrollY;
    };

    updateHeaderVisibility();
    window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderVisibility);
    };
  }, [activeSection, isMenuOpen]);

  return (
    <main className="h-dvh overflow-x-clip bg-[#8f9a94]">
      <SiteHeader isMenuOpen={isMenuOpen} isPastHero={isPastHero} isVisible={isHeaderVisible} onOpenMenu={() => setIsMenuOpen((open) => !open)} sticky />
      <HeroSection heroImagePath={content.heroImagePath} services={content.services} contactSocials={content.contactSocials} />
      <AboutSection />
      <ProjectsSection projects={content.projects} />
      <AchievementSection achievements={content.achievements} />
      <ContactSection contactSocials={content.contactSocials} />
      <MenuOverlay menuItems={content.menuItems} activeSection={activeSection} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </main>
  );
}
