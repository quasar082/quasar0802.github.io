'use client';

import {useRef, useCallback} from 'react';
import {gsap} from '@/lib/animations/gsap';

interface MagneticHoverProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticHover({
  children,
  strength = 20,
  className,
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const {left, top, width, height} = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * strength * 2;
      const y = ((e.clientY - top) / height - 0.5) * strength * 2;

      // Lazily initialize quickTo on first move
      if (!xTo.current) {
        xTo.current = gsap.quickTo(el, 'x', {
          duration: 0.4,
          ease: 'power3.out',
        });
      }
      if (!yTo.current) {
        yTo.current = gsap.quickTo(el, 'y', {
          duration: 0.4,
          ease: 'power3.out',
        });
      }

      xTo.current(x);
      yTo.current(y);
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Kill any active quickTo tweens
    gsap.killTweensOf(el);

    // Animate back to origin with elastic snap
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
      overwrite: true,
    });

    // Reset quickTo refs so they are recreated fresh on next hover
    xTo.current = null;
    yTo.current = null;
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{display: 'inline-block'}}
    >
      {children}
    </div>
  );
}
