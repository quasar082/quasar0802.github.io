'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type HomePreloaderProps = {
  heroImagePath: string;
};

type PreloaderVars = CSSProperties & {
  '--split-offset'?: string;
  '--title-balance'?: string;
};

export function HomePreloader({ heroImagePath }: HomePreloaderProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const quasarRef = useRef<HTMLSpanElement>(null);
  const portfolioRef = useRef<HTMLSpanElement>(null);
  const [preloaderVars, setPreloaderVars] = useState<PreloaderVars>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateMobileState();
    window.addEventListener('resize', updateMobileState);

    return () => {
      window.removeEventListener('resize', updateMobileState);
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const quasar = quasarRef.current;
    const portfolio = portfolioRef.current;

    if (!stage || !quasar || !portfolio || isMobile) {
      return;
    }

    const updateSplitMetrics = () => {
      const styles = window.getComputedStyle(stage);
      const imageScale = Number.parseFloat(styles.getPropertyValue('--image-scale')) || 0.18;
      const imageGap = Math.max(8, Math.min(window.innerWidth * 0.01, 16));
      const splitOffset = window.innerWidth * imageScale * 0.5 + imageGap;
      const titleBalance = (portfolio.offsetWidth - quasar.offsetWidth) * 0.5;

      setPreloaderVars({
        '--split-offset': `${splitOffset}px`,
        '--title-balance': `${titleBalance}px`,
      } as PreloaderVars);
    };

    updateSplitMetrics();
    document.fonts?.ready.then(updateSplitMetrics);
    window.addEventListener('resize', updateSplitMetrics);

    return () => {
      window.removeEventListener('resize', updateSplitMetrics);
    };
  }, [isMobile]);

  return (
    <div className="pointer-events-auto fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-white text-[#111] [animation:home-preloader-exit_520ms_ease-in-out_2700ms_forwards] motion-reduce:hidden" aria-hidden="true">
      <span className="sr-only">QUASAR PORTFOLIO</span>

      <div ref={stageRef} style={preloaderVars} className="relative flex h-screen w-screen items-center justify-center px-6 [--image-scale:0.26] [--split-offset:calc(13vw+clamp(0.5rem,1vw,1rem))] [--title-balance:0px] [--title-size:clamp(1.15rem,8vw,2.35rem)] sm:[--image-scale:0.2] sm:[--split-offset:calc(10vw+clamp(0.5rem,1vw,1rem))] sm:[--title-size:clamp(1.7rem,6vw,4.5rem)] lg:[--image-scale:0.22] lg:[--split-offset:calc(11vw+clamp(0.5rem,1vw,1rem))] lg:[--title-size:clamp(1.9rem,5vw,5.5rem)] xl:[--title-size:clamp(2.1rem,5.8vw,6.5rem)] 2xl:[--title-size:clamp(2.4rem,6.2vw,7.2rem)]">
        <div className="absolute inset-0 z-10 grid place-items-center whitespace-nowrap text-[length:var(--title-size)] font-normal leading-none tracking-[-0.04em] text-[#111] opacity-0 [animation:home-preloader-title_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          <div className={isMobile ? 'inline-flex gap-[0.18em] [animation:home-preloader-mobile-title_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]' : 'inline-flex gap-[0.18em] [animation:home-preloader-title-gap_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]'}>
            <span ref={quasarRef} className={isMobile ? '' : '[animation:home-preloader-left_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]'}>QUASAR</span>
            <span ref={portfolioRef} className={isMobile ? '' : '[animation:home-preloader-right_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]'}>PORTFOLIO</span>
          </div>
        </div>

        <div className="relative z-20 h-screen w-screen overflow-hidden opacity-0 shadow-2xl [transform:translateZ(0)_scale(var(--image-scale))] [transform-origin:center] [will-change:transform,opacity] [animation:home-preloader-image_3s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          {/* Native img keeps parity with the existing static-export hero asset path. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImagePath} alt="" decoding="async" className="h-full w-full object-cover" />
        </div>
      </div>

      <style jsx>{`
        @keyframes home-preloader-title {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          18%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes home-preloader-title-gap {
          0%,
          34% {
            gap: 0.18em;
          }
          58%,
          100% {
            gap: 0;
          }
        }

        @keyframes home-preloader-mobile-title {
          0%,
          34% {
            transform: translateY(0);
          }
          58%,
          100% {
            transform: translateY(calc(var(--image-scale) * 100vh * 0.5 + 1.5rem));
          }
        }

        @keyframes home-preloader-left {
          0%,
          34% {
            transform: translate3d(0, 0, 0);
          }
          58%,
          100% {
            transform: translate3d(calc(var(--title-balance) - var(--split-offset)), 0, 0);
          }
        }

        @keyframes home-preloader-right {
          0%,
          34% {
            transform: translate3d(0, 0, 0);
          }
          58%,
          100% {
            transform: translate3d(calc(var(--split-offset) + var(--title-balance)), 0, 0);
          }
        }

        @keyframes home-preloader-image {
          0%,
          36% {
            opacity: 0;
            transform: translateZ(0) scale(var(--image-scale));
          }
          54%,
          68% {
            opacity: 1;
            transform: translateZ(0) scale(var(--image-scale));
          }
          100% {
            opacity: 1;
            transform: translateZ(0) scale(1);
          }
        }

        @keyframes home-preloader-exit {
          0% {
            opacity: 1;
            visibility: visible;
          }
          99% {
            opacity: 0;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
