'use client';

import {useState, useRef, useCallback, useEffect} from 'react';
import {gsap} from '@/lib/animations/gsap';
import {TextRoll} from './text-roll';

interface NavLinkProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function NavLink({label, isActive, onClick}: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (reducedMotion.current) return;
    const el = btnRef.current;
    if (!el) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (reducedMotion.current) return;
    const el = btnRef.current;
    if (!el) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, []);

  const showArrow = isHovered;
  const showDot = isActive && !isHovered;

  return (
    <button
      ref={btnRef}
      type="button"
      role="menuitem"
      aria-current={isActive ? 'true' : undefined}
      className="nav-link flex items-center justify-between w-full font-body text-[18px] font-normal uppercase tracking-[0.04em] cursor-pointer"
      style={{
        height: '52px',
        padding: '0 24px',
        borderRadius: '12px',
        color: 'var(--greige-900)',
        backgroundColor: isHovered ? 'var(--greige-200)' : 'transparent',
        transition: 'background-color 200ms ease',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TextRoll>{label}</TextRoll>
      <span style={{width: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {showArrow && (
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRight: '1.5px solid var(--greige-900)',
              borderTop: '1.5px solid var(--greige-900)',
              transform: 'rotate(45deg)',
            }}
          />
        )}
        {showDot && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--greige-900)',
            }}
          />
        )}
      </span>
    </button>
  );
}
