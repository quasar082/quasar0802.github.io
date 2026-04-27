'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

type CursorHoverImageProps = {
  children: ReactNode;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  easing?: number;
  className?: string;
  imageClassName?: string;
};

export function CursorHoverImage({
  children,
  src,
  alt = '',
  width = 300,
  height = 190,
  offsetX = 18,
  offsetY = 18,
  easing = 0.16,
  className,
  imageClassName,
}: CursorHoverImageProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(canHover);
  }, []);

  const stopRaf = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startRaf = () => {
    if (rafRef.current !== null) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smooth = reducedMotion ? 1 : easing;

    const tick = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      current.x += (target.x - current.x) * smooth;
      current.y += (target.y - current.y) * smooth;

      setPosition({ x: current.x, y: current.y });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) {
      return;
    }

    const x = event.clientX + offsetX;
    const y = event.clientY + offsetY;

    targetRef.current = { x, y };

    if (!visible) {
      currentRef.current = { x, y };
      setPosition({ x, y });
    }
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) {
      return;
    }

    const x = event.clientX + offsetX;
    const y = event.clientY + offsetY;

    targetRef.current = { x, y };
    currentRef.current = { x, y };
    setPosition({ x, y });
    setVisible(true);
    startRaf();
  };

  const handlePointerLeave = () => {
    setVisible(false);
    stopRaf();
  };

  useEffect(() => {
    return () => {
      stopRaf();
    };
  }, []);

  return (
    <span
      ref={triggerRef}
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      {enabled ? (
        <span
          className={`pointer-events-none fixed left-0 top-0 z-[70] overflow-hidden rounded-xl border border-white/40 bg-black/70 shadow-2xl transition-opacity duration-150 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width,
            height,
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
          aria-hidden="true"
        >
          <img src={src} alt={alt} className={`h-full w-full object-cover ${imageClassName ?? ''}`} draggable={false} />
        </span>
      ) : null}
    </span>
  );
}
