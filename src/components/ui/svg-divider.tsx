'use client';

import { useRef } from 'react';
import { gsap, DrawSVGPlugin, useGSAP } from '@/lib/animations/gsap';
import { usePreloaderDone } from '@/lib/hooks/use-preloader-done';

// Ensure DrawSVGPlugin is available
void DrawSVGPlugin;

export function SvgDivider() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const preloaderDone = usePreloaderDone();

  useGSAP(
    () => {
      if (!pathRef.current || !preloaderDone) return;

      gsap.from(pathRef.current, {
        drawSVG: '0%',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: svgRef, dependencies: [preloaderDone] },
  );

  return (
    <div className="mx-auto w-full max-w-screen-2xl py-8">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 80"
        fill="none"
        className="w-full"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M0,40 Q300,0 600,40 T1200,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />
      </svg>
    </div>
  );
}
