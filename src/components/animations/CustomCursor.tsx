'use client';

import {useRef, useEffect, useState} from 'react';
import {gsap} from '@/lib/gsap';

type CursorState = 'default' | 'expand' | 'text' | 'drag' | 'magnetic';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect pointer:fine (desktop with precise pointer)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Set up cursor tracking, event delegation, and state management
  useEffect(() => {
    if (!isDesktop || !dotRef.current || !ringWrapRef.current || !ringRef.current || !circleRef.current || !labelRef.current) return;

    const dot = dotRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    const circle = circleRef.current;
    const label = labelRef.current;

    let currentState: CursorState = 'default';
    let currentMagneticTarget: HTMLElement | null = null;
    let spinTween: gsap.core.Tween | null = null;

    // SVG is always 100x100 viewBox, we scale via width/height
    const SVG_SIZE = 100;
    const SVG_CENTER = 50;
    const SVG_R = 48; // radius within 100x100 viewBox
    const CIRCUMFERENCE = 2 * Math.PI * SVG_R;

    // Set initial circle attributes
    circle.setAttribute('cx', String(SVG_CENTER));
    circle.setAttribute('cy', String(SVG_CENTER));
    circle.setAttribute('r', String(SVG_R));
    // Full dasharray = solid line (no gaps visible)
    circle.style.strokeDasharray = `${CIRCUMFERENCE}`;
    circle.style.strokeDashoffset = '0';

    // Hide default cursor
    document.documentElement.style.cursor = 'none';
    const styleTag = document.createElement('style');
    styleTag.textContent =
      'a, button, [role="button"], [data-cursor-hover], [data-cursor-text], [data-cursor-drag], [data-cursor-magnetic] { cursor: none !important; }';
    document.head.appendChild(styleTag);

    // Smooth cursor follow via gsap.quickTo — dot is instant, ring trails
    const dotXTo = gsap.quickTo(dot, 'x', {duration: 0.05, ease: 'power3'});
    const dotYTo = gsap.quickTo(dot, 'y', {duration: 0.05, ease: 'power3'});
    // Position the wrapper div (not SVG) so rotation doesn't conflict
    const ringXTo = gsap.quickTo(ringWrap, 'x', {duration: 0.2, ease: 'power3'});
    const ringYTo = gsap.quickTo(ringWrap, 'y', {duration: 0.2, ease: 'power3'});
    const labelXTo = gsap.quickTo(label, 'x', {duration: 0.2, ease: 'power3'});
    const labelYTo = gsap.quickTo(label, 'y', {duration: 0.2, ease: 'power3'});

    // Size constants (actual rendered px via width/height on SVG)
    const DEFAULT_SIZE = 48;
    const EXPAND_SIZE = 72;
    const TEXT_SIZE = 80;
    const DRAG_SIZE = 64;

    // Start dashed spinning animation
    const startSpin = () => {
      // Switch to dashed pattern
      gsap.to(circle.style, {
        strokeDasharray: '10 8',
        duration: 0.4,
        ease: 'power2.out',
      });
      // Continuous rotation on SVG element
      if (spinTween) spinTween.kill();
      spinTween = gsap.to(ring, {
        rotation: 360,
        duration: 4,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });
    };

    const stopSpin = () => {
      if (spinTween) {
        spinTween.kill();
        spinTween = null;
      }
      gsap.set(ring, {rotation: 0});
      // Back to solid line
      gsap.to(circle.style, {
        strokeDasharray: `${CIRCUMFERENCE}`,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    // setCursorState — manages transitions between cursor states
    const setCursorState = (
      state: CursorState,
      magneticTarget?: HTMLElement | null,
      labelText?: string
    ) => {
      if (state === currentState) return;
      currentState = state;

      // Clean up previous magnetic target
      if (currentMagneticTarget && state !== 'magnetic') {
        gsap.to(currentMagneticTarget, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'elastic.out(1, 0.3)',
        });
        currentMagneticTarget = null;
      }

      switch (state) {
        case 'default':
          stopSpin();
          gsap.to(dot, {opacity: 1, duration: 0.3, ease: 'power2.out'});
          gsap.to(ringWrap, {
            width: DEFAULT_SIZE,
            height: DEFAULT_SIZE,
            opacity: 1,
            mixBlendMode: 'normal',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(circle, {
            attr: {stroke: 'rgba(26, 26, 26, 0.3)', 'stroke-width': 1.5, fill: 'transparent'},
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(label, {opacity: 0, duration: 0.2});
          break;

        case 'expand':
          gsap.to(dot, {opacity: 1, duration: 0.3, ease: 'power2.out'});
          gsap.to(ringWrap, {
            width: EXPAND_SIZE,
            height: EXPAND_SIZE,
            opacity: 1,
            mixBlendMode: 'difference',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(circle, {
            attr: {stroke: 'currentColor', 'stroke-width': 1.5, fill: 'transparent'},
            duration: 0.3,
            ease: 'power2.out',
          });
          startSpin();
          gsap.to(label, {opacity: 0, duration: 0.2});
          break;

        case 'text':
          stopSpin();
          gsap.to(dot, {opacity: 0, duration: 0.3, ease: 'power2.out'});
          gsap.to(ringWrap, {
            width: TEXT_SIZE,
            height: TEXT_SIZE,
            opacity: 1,
            mixBlendMode: 'normal',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(circle, {
            attr: {stroke: '#111111', 'stroke-width': 0, fill: '#111111'},
            duration: 0.3,
            ease: 'power2.out',
          });
          label.textContent = labelText || 'View';
          gsap.to(label, {opacity: 1, duration: 0.3, ease: 'power2.out'});
          break;

        case 'drag':
          stopSpin();
          gsap.to(dot, {opacity: 0, duration: 0.3, ease: 'power2.out'});
          gsap.to(ringWrap, {
            width: DRAG_SIZE,
            height: DRAG_SIZE,
            opacity: 1,
            mixBlendMode: 'normal',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(circle, {
            attr: {stroke: '#111111', 'stroke-width': 0, fill: '#111111'},
            duration: 0.3,
            ease: 'power2.out',
          });
          label.textContent = '\u2190\u2192 Drag';
          gsap.to(label, {opacity: 1, duration: 0.3, ease: 'power2.out'});
          break;

        case 'magnetic':
          stopSpin();
          gsap.to(dot, {opacity: 0, duration: 0.3, ease: 'power2.out'});
          gsap.to(ringWrap, {opacity: 0, duration: 0.3, ease: 'power2.out'});
          if (magneticTarget) currentMagneticTarget = magneticTarget;
          break;
      }
    };

    // Mouse move handler — update cursor positions + magnetic effect
    const onMouseMove = (e: MouseEvent) => {
      dotXTo(e.clientX);
      dotYTo(e.clientY);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
      labelXTo(e.clientX);
      labelYTo(e.clientY);

      // Magnetic effect: shift target element toward cursor
      if (currentState === 'magnetic' && currentMagneticTarget) {
        const rect = currentMagneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;
        gsap.to(currentMagneticTarget, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Event delegation: mouseover on document
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const magnetic = target.closest('[data-cursor-magnetic]') as HTMLElement | null;
      if (magnetic) {
        setCursorState('magnetic', magnetic);
        return;
      }

      if (target.closest('[data-cursor-drag]')) {
        setCursorState('drag');
        return;
      }

      const textEl = target.closest('[data-cursor-text]') as HTMLElement | null;
      if (textEl) {
        const text = textEl.getAttribute('data-cursor-text') || 'View';
        setCursorState('text', undefined, text);
        return;
      }

      if (target.closest('a, button, [data-cursor-hover]')) {
        setCursorState('expand');
        return;
      }
    };

    // Event delegation: mouseout on document
    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      if (relatedTarget) {
        if (
          relatedTarget.closest('[data-cursor-magnetic]') ||
          relatedTarget.closest('[data-cursor-drag]') ||
          relatedTarget.closest('[data-cursor-text]') ||
          relatedTarget.closest('a, button, [data-cursor-hover]')
        ) {
          return;
        }
      }

      setCursorState('default');
    };

    // Attach listeners
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);

      document.documentElement.style.cursor = '';
      styleTag.remove();

      if (spinTween) spinTween.kill();

      if (currentMagneticTarget) {
        gsap.to(currentMagneticTarget, {x: 0, y: 0, duration: 0.3});
        currentMagneticTarget = null;
      }

      gsap.set(ringWrap, {opacity: 1});
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const DEFAULT_SIZE = 48;

  return (
    <>
      {/* Dot - 8px filled circle, instant follow */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#1A1A1A',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Ring wrapper - positioned by GSAP x/y */}
      <div
        ref={ringWrapRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: DEFAULT_SIZE,
          height: DEFAULT_SIZE,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Ring SVG - rotated by GSAP for spin effect */}
        <svg
          ref={ringRef}
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          style={{overflow: 'visible'}}
        >
          <circle
            ref={circleRef}
            cx={50}
            cy={50}
            r={48}
            fill="transparent"
            stroke="rgba(26, 26, 26, 0.3)"
            strokeWidth={1.5}
          />
        </svg>
      </div>
      {/* Floating label for text/drag states */}
      <span
        ref={labelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: 14,
          fontWeight: 400,
          textTransform: 'uppercase',
          color: '#FFFFFF',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10000,
          whiteSpace: 'nowrap',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}
