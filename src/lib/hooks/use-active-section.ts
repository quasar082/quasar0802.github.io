'use client';

import {useState, useEffect} from 'react';

export const NAV_SECTIONS = [
  {id: null, label: 'home', scrollTarget: 0 as const},
  {id: 'about', label: 'aboutMe', scrollTarget: '#about' as const},
  {id: 'achievements', label: 'highlight', scrollTarget: '#achievements' as const},
  {id: 'projects', label: 'work', scrollTarget: '#projects' as const},
  {id: 'contact', label: 'contact', scrollTarget: '#contact' as const},
] as const;

const SECTION_IDS = NAV_SECTIONS.filter((s) => s.id !== null) as Array<{id: string; label: string}>;

export function useActiveSection(): string {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = SECTION_IDS.find((s) => s.id === entry.target.id);
            if (match) setActive(match.label);
          }
        }
      },
      {rootMargin: '-40% 0px -40% 0px', threshold: 0},
    );

    const elements: Element[] = [];
    for (const {id} of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    const handleScroll = () => {
      if (window.scrollY < 200) setActive('home');
    };
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return active;
}
