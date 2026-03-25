'use client';

import {useRef, useCallback, useEffect} from 'react';
import {gsap} from '@/lib/gsap';
import {TextRoll} from './TextRoll';

interface PillButtonProps {
  label: string;
  variant: 'dark' | 'light';
  onClick?: () => void;
  href?: string;
  dots?: 'single' | 'double' | 'none';
  dotsRotated?: boolean;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  className?: string;
  hidden?: boolean;
}

const VARIANT_STYLES = {
  dark: {
    bg: 'var(--greige-900)',
    hoverBg: 'var(--greige-700)',
    text: 'var(--warm-white)',
  },
  light: {
    bg: 'var(--warm-white-overlay)',
    hoverBg: 'var(--greige-200)',
    text: 'var(--greige-900)',
  },
} as const;

export function PillButton({
  label,
  variant,
  onClick,
  href,
  dots = 'none',
  dotsRotated = false,
  ariaLabel,
  ariaExpanded,
  ariaControls,
  className = '',
  hidden = false,
}: PillButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animate dot rotation when dotsRotated changes
  useEffect(() => {
    if (!dotsRef.current || dots !== 'double') return;
    if (reducedMotion.current) {
      gsap.set(dotsRef.current, {rotate: dotsRotated ? 90 : 0});
    } else {
      gsap.to(dotsRef.current, {rotate: dotsRotated ? 90 : 0, duration: 0.3, ease: 'power2.inOut'});
    }
  }, [dotsRotated, dots]);

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.backgroundColor = VARIANT_STYLES[variant].hoverBg;
    if (reducedMotion.current) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, [variant]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.backgroundColor = VARIANT_STYLES[variant].bg;
    if (reducedMotion.current) return;
    const spans = el.querySelectorAll('.roll-text');
    gsap.to(spans, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
  }, [variant]);

  const style = VARIANT_STYLES[variant];
  const hasDots = dots !== 'none';

  const commonProps = {
    ref,
    className: `inline-flex items-center cursor-pointer select-none font-body text-[15px] font-medium uppercase tracking-[0.08em] ${hidden ? 'hidden sm:inline-flex' : ''} ${className}`.trim(),
    style: {
      backgroundColor: style.bg,
      color: style.text,
      borderRadius: '9999px',
      height: '48px',
      paddingLeft: '40px',
      paddingRight: hasDots ? '32px' : '40px',
      gap: hasDots ? '10px' : undefined,
      transition: 'background-color 300ms ease',
    } as React.CSSProperties,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-label': ariaLabel,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
  };

  const content = (
    <>
      <TextRoll>{label}</TextRoll>
      {dots === 'single' && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: style.text,
            flexShrink: 0,
          }}
        />
      )}
      {dots === 'double' && (
        <span
          style={{
            width: '14px',
            height: '14px',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <span
            ref={dotsRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: dotsRotated ? 'var(--greige-900)' : 'var(--greige-500)',
                transition: 'background-color 200ms ease',
              }}
            />
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: dotsRotated ? 'var(--greige-900)' : 'var(--greige-500)',
                transition: 'background-color 200ms ease',
              }}
            />
          </span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a {...commonProps} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} onClick={onClick} type="button">
      {content}
    </button>
  );
}
