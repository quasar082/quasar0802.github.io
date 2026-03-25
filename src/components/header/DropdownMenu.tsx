'use client';

import {useRef, useEffect, useCallback, useState, type RefObject} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';
import {useLenis} from 'lenis/react';
import {useTranslations} from 'next-intl';
import {NavLink} from './NavLink';
import {useActiveSection, NAV_SECTIONS} from './useActiveSection';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  actionsRef: RefObject<HTMLDivElement | null>;
}

/* ─── Arrow icon with TextRoll-style hover ─── */
function ArrowIcon({color = 'currentColor'}: {color?: string}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9L9 3M9 3H4M9 3V8" />
    </svg>
  );
}

function ExternalButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: 'light' | 'dark';
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isLight = variant === 'light';
  const bg = isLight ? 'var(--warm-white)' : 'var(--greige-900)';
  const hoverBg = isLight ? 'var(--greige-200)' : 'var(--greige-700)';
  const textColor = isLight ? 'var(--greige-900)' : 'var(--warm-white)';

  const handleMouseEnter = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.backgroundColor = hoverBg;
    if (reducedMotion.current) return;
    const rolls = el.querySelectorAll('.roll-text, .arrow-roll');
    if (rolls.length) {
      gsap.to(rolls, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
    }
  }, [hoverBg]);

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.backgroundColor = bg;
    if (reducedMotion.current) return;
    const rolls = el.querySelectorAll('.roll-text, .arrow-roll');
    if (rolls.length) {
      gsap.to(rolls, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
    }
  }, [bg]);

  return (
    <a
      ref={btnRef}
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      role="menuitem"
      className="dropdown-item flex items-center justify-between h-16 px-6 rounded-xl font-body text-[18px] font-medium uppercase tracking-[0.06em] cursor-pointer"
      style={{
        backgroundColor: bg,
        color: textColor,
        transition: 'background-color 200ms ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Label with TextRoll */}
      <span style={{overflow: 'hidden', position: 'relative', height: '1em', lineHeight: 1}}>
        <span className="roll-text" style={{display: 'block'}}>{label}</span>
        <span className="roll-text" style={{display: 'block'}}>{label}</span>
      </span>
      {/* Arrow with TextRoll-style animation */}
      <span
        style={{overflow: 'hidden', position: 'relative', height: '14px', width: '14px', flexShrink: 0}}
      >
        <span className="arrow-roll" style={{display: 'block'}}>
          <ArrowIcon color={textColor} />
        </span>
        <span className="arrow-roll" style={{display: 'block'}}>
          <ArrowIcon color={textColor} />
        </span>
      </span>
    </a>
  );
}

/* ─── Main dropdown ─── */
export function DropdownMenu({isOpen, onClose, actionsRef}: DropdownMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeSection = useActiveSection();
  const t = useTranslations('Header');
  const lenis = useLenis();
  const reducedMotion = useRef(false);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Measure actions container width
  useEffect(() => {
    if (!actionsRef.current) return;
    const measure = () => {
      const w = actionsRef.current?.offsetWidth ?? 0;
      setDropdownWidth(w);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [actionsRef]);

  // Build GSAP timeline
  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      const items = el.querySelectorAll('.dropdown-item, .dropdown-card');

      if (reducedMotion.current) {
        const tl = gsap.timeline({paused: true});
        tl.fromTo(items, {opacity: 0}, {opacity: 1, duration: 0.01});
        tlRef.current = tl;
        return;
      }

      const tl = gsap.timeline({paused: true});

      tl.fromTo(
        items,
        {opacity: 0, y: 12},
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
        },
      );

      tlRef.current = tl;
    },
    {scope: wrapperRef},
  );

  // Play/reverse on isOpen change
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.4).reverse();
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const firstLink = wrapperRef.current?.querySelector<HTMLButtonElement>('.nav-link');
        firstLink?.focus();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      const menuBtn = document.querySelector<HTMLElement>('[aria-controls="header-dropdown"]');
      menuBtn?.focus();
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const el = wrapperRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Nav link click handler
  const handleNavClick = useCallback(
    (scrollTarget: string | number) => {
      onClose();
      setTimeout(() => {
        const easing = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        if (typeof scrollTarget === 'number') {
          lenis?.scrollTo(0, {
            duration: reducedMotion.current ? 0 : 1.2,
            easing,
          });
        } else {
          lenis?.scrollTo(scrollTarget, {
            offset: -80,
            duration: reducedMotion.current ? 0 : 1.2,
            easing,
          });
        }
      }, 100);
    },
    [onClose, lenis],
  );

  const widthStyle = dropdownWidth > 0 ? {width: `${dropdownWidth}px`} : {width: '280px'};

  return (
    <>
      {/* Click-outside overlay */}
      {isOpen && <div className="fixed inset-0 z-[48]" onClick={onClose} aria-hidden="true" />}

      {/* Dropdown wrapper: 3 separate floating elements stacked */}
      <div
        ref={wrapperRef}
        id="header-dropdown"
        role="menu"
        aria-hidden={!isOpen}
        className="absolute right-4 sm:right-6 lg:right-8 z-[49] flex flex-col gap-3"
        style={{
          top: '100%',
          marginTop: '8px',
          pointerEvents: isOpen ? 'auto' : 'none',
          ...widthStyle,
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {/* Card 1: Nav links */}
        <div
          className="dropdown-card dropdown-item rounded-2xl p-3"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            opacity: 0,
          }}
        >
          <nav>
            {NAV_SECTIONS.map(({label, scrollTarget}) => (
              <NavLink
                key={label}
                label={t(label)}
                isActive={activeSection === label}
                onClick={() => handleNavClick(scrollTarget)}
              />
            ))}
          </nav>
        </div>

        {/* Button 2: Blog */}
        <div
          className="dropdown-item"
          style={{
            opacity: 0,
          }}
        >
          <ExternalButton
            href="/blog"
            label={t('blog')}
            variant="light"
          />
        </div>

        {/* Button 3: GitHub */}
        <div
          className="dropdown-item"
          style={{
            opacity: 0,
          }}
        >
          <ExternalButton
            href="https://github.com/rayquasar18"
            label={t('github')}
            variant="dark"
          />
        </div>
      </div>
    </>
  );
}
