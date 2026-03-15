'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {Menu, X} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MobileMenu} from './MobileMenu';

const SCROLL_THRESHOLD = 20;

export function Header() {
  const t = useTranslations('Header');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-surface-base/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        {/* Brand mark -- text-only minimal logo */}
        <Link
          href="/"
          className="font-display text-lg tracking-wider uppercase text-text-primary"
        >
          Quasar
        </Link>

        {/* Desktop nav + language switcher */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm uppercase tracking-wider text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {t('home')}
            </Link>
            <Link
              href="/"
              className="text-sm uppercase tracking-wider text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {t('about')}
            </Link>
            <Link
              href="/"
              className="text-sm uppercase tracking-wider text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {t('projects')}
            </Link>
            <Link
              href="/"
              className="text-sm uppercase tracking-wider text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {t('blog')}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-text-secondary transition-colors duration-150 hover:text-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
