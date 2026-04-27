'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

type CursorHoverCardProps = {
  children: ReactNode;
  label: string;
  iconVariant?: 'arrow-right' | 'arrow-up-right';
  offsetX?: number;
  offsetY?: number;
  easing?: number;
  className?: string;
};

export function CursorHoverCard({
  children,
  label,
  iconVariant = 'arrow-right',
  offsetX = 18,
  offsetY = 18,
  easing = 0.16,
  className,
}: CursorHoverCardProps) {
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
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      {enabled ? (
        <span
          className={`pointer-events-none fixed left-0 top-0 z-[70] inline-flex items-center gap-2 rounded-2xl border border-white/35 bg-black/85 py-[1.1rem] px-11 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-2xl transition-opacity duration-150 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
          aria-hidden="true"
        >
          <span>{label}</span>
          {iconVariant === 'arrow-up-right' ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
        </span>
      ) : null}
    </span>
  );
}
