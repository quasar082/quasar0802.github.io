'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from '@/i18n/navigation';
import {gsap, useGSAP} from '@/lib/gsap';
import {TransitionLink} from '@/components/transitions/TransitionLink';
import {PillButton} from './header/PillButton';
import {DropdownMenu} from './header/DropdownMenu';
import {useHeaderScroll} from './header/useHeaderScroll';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';

export function Header() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const localeBtnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useRef(false);
  const preloaderDone = usePreloaderDone();

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Header entrance: fade in after preloader
  useGSAP(
    () => {
      if (!preloaderDone || !headerRef.current) return;
      gsap.fromTo(
        headerRef.current,
        {opacity: 0, y: -20},
        {opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'}
      );
    },
    {dependencies: [preloaderDone]}
  );

  const toggleLocale = useCallback(() => {
    const next = locale === 'en' ? 'vi' : 'en';
    localStorage.setItem('preferred-locale', next);
    // Static export: navigate directly via URL
    const cleanPath = pathname === '/' ? '/' : pathname;
    window.location.href = `/${next}${cleanPath}`;
  }, [locale, pathname]);

  const handleLocaleBtnEnter = useCallback(() => {
    const el = localeBtnRef.current;
    if (!el) return;
    el.style.backgroundColor = 'var(--greige-200)';
    if (reducedMotion.current) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  const handleLocaleBtnLeave = useCallback(() => {
    const el = localeBtnRef.current;
    if (!el) return;
    el.style.backgroundColor = 'var(--warm-white-overlay)';
    if (reducedMotion.current) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useHeaderScroll({
    headerRef,
    menuOpen,
    onScrollClose: closeMenu,
  });

  const currentLabel = locale === 'en' ? 'EN' : 'VI';
  const altLabel = locale === 'en' ? 'VI' : 'EN';

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{opacity: 0}}>
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 pointer-events-auto">
        {/* Left: Logo */}
        <TransitionLink
          href="/"
          className="font-body text-[24px] font-medium uppercase tracking-[0.1em] leading-[48px] transition-colors duration-200"
          style={{color: 'var(--greige-900)'}}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--greige-700)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--greige-900)';
          }}
        >
          QUASAR
        </TransitionLink>

        {/* Right: Actions */}
        <div ref={actionsRef} className="flex items-center gap-2">
          {/* Language Toggle - circle with TextRoll */}
          <button
            ref={localeBtnRef}
            onClick={toggleLocale}
            className="flex items-center justify-center w-12 h-12 rounded-full text-[15px] font-medium uppercase tracking-[0.08em] font-body cursor-pointer select-none"
            style={{
              backgroundColor: 'var(--warm-white-overlay)',
              color: 'var(--greige-900)',
              transition: 'background-color 300ms ease',
            }}
            onMouseEnter={handleLocaleBtnEnter}
            onMouseLeave={handleLocaleBtnLeave}
            aria-label={t('switchLang')}
            type="button"
            suppressHydrationWarning
          >
            {/* TextRoll-style: two copies, roll on hover */}
            <span style={{overflow: 'hidden', position: 'relative', height: '1em', lineHeight: 1, width: '2ch', textAlign: 'center'}}>
              <span className="roll-text" style={{display: 'block'}}>{currentLabel}</span>
              <span className="roll-text" style={{display: 'block'}}>{altLabel}</span>
            </span>
          </button>

          {/* LET'S TALK - dark pill, hidden on mobile */}
          <PillButton
            label={t('letsTalk')}
            variant="dark"
            href="mailto:haminhquan12c7@gmail.com"
            dots="single"
            ariaLabel="Send email"
            hidden={true}
          />

          {/* MENU/CLOSE - light pill */}
          <PillButton
            label={menuOpen ? t('close') : t('menu')}
            variant="light"
            onClick={toggleMenu}
            dots="double"
            dotsRotated={menuOpen}
            ariaLabel={menuOpen ? 'Close menu' : 'Open menu'}
            ariaExpanded={menuOpen}
            ariaControls="header-dropdown"
            fixedWidth={140}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu isOpen={menuOpen} onClose={closeMenu} actionsRef={actionsRef} />
    </header>
  );
}
