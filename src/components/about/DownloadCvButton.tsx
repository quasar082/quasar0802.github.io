'use client';

import {useRef, useCallback} from 'react';
import {gsap} from '@/lib/gsap';

const SLOT_WIDTH = 20; // 16px icon + 4px breathing room

export function DownloadCvButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const iconSlot = el.querySelector('.cv-icon-slot') as HTMLElement;
    const dotSlot = el.querySelector('.cv-dot-slot') as HTMLElement;
    const spans = el.querySelectorAll('.roll-text');
    if (iconSlot) gsap.to(iconSlot, {width: SLOT_WIDTH, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (dotSlot) gsap.to(dotSlot, {width: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    gsap.to(spans, {y: '-100%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
    el.style.backgroundColor = 'var(--greige-100)';
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const iconSlot = el.querySelector('.cv-icon-slot') as HTMLElement;
    const dotSlot = el.querySelector('.cv-dot-slot') as HTMLElement;
    const spans = el.querySelectorAll('.roll-text');
    if (iconSlot) gsap.to(iconSlot, {width: 0, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    if (dotSlot) gsap.to(dotSlot, {width: SLOT_WIDTH, duration: 0.35, ease: 'power3.inOut', overwrite: true});
    gsap.to(spans, {y: '0%', duration: 0.35, ease: 'power3.inOut', overwrite: true});
    el.style.backgroundColor = 'transparent';
  }, []);

  return (
    <a
      ref={btnRef}
      href="/cv.pdf"
      download
      className="inline-flex items-center cursor-pointer select-none font-body text-[15px] font-medium uppercase tracking-[0.08em]"
      style={{
        backgroundColor: 'transparent',
        color: 'var(--greige-900)',
        border: '1px solid var(--greige-900)',
        borderRadius: '9999px',
        height: '48px',
        paddingLeft: '30px',
        paddingRight: '30px',
        transition: 'background-color 300ms ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon slot — width 0 by default, expands on hover */}
      <span
        className="cv-icon-slot"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          overflow: 'hidden',
          width: 0,
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>

      {/* Text with roll effect */}
      <div style={{overflow: 'hidden', position: 'relative', height: '1em', lineHeight: 1}}>
        <span className="roll-text" style={{display: 'block'}}>Download CV</span>
        <span className="roll-text" style={{display: 'block'}}>Download CV</span>
      </div>

      {/* Dot slot — width 20 by default, collapses on hover */}
      <span
        className="cv-dot-slot"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          width: SLOT_WIDTH,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'var(--greige-900)',
            flexShrink: 0,
          }}
        />
      </span>
    </a>
  );
}
