'use client';

import {useRef, useEffect, useState} from 'react';
import {gsap} from '@/lib/gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect pointer:fine (desktop with precise pointer)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Set up cursor tracking and hover scaling
  useEffect(() => {
    if (!isDesktop || !cursorRef.current) return;

    const cursor = cursorRef.current;

    // Hide default cursor
    document.documentElement.style.cursor = 'none';
    const styleTag = document.createElement('style');
    styleTag.textContent = 'a, button, [role="button"] { cursor: none !important; }';
    document.head.appendChild(styleTag);

    // Smooth cursor follow via gsap.quickTo
    const xTo = gsap.quickTo(cursor, 'x', {duration: 0.2, ease: 'power3'});
    const yTo = gsap.quickTo(cursor, 'y', {duration: 0.2, ease: 'power3'});

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Hover scaling on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, [data-cursor-hover]'
    );

    const onEnter = () => {
      gsap.to(cursor, {scale: 2.5, duration: 0.3});
    };
    const onLeave = () => {
      gsap.to(cursor, {scale: 1, duration: 0.3});
    };

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      // Restore default cursor
      document.documentElement.style.cursor = '';
      styleTag.remove();

      window.removeEventListener('mousemove', onMouseMove);

      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [isDesktop]);

  // Do not render anything on touch/mobile
  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
