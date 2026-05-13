'use client';

type HomePreloaderProps = {
  heroImagePath: string;
};

export function HomePreloader({ heroImagePath }: HomePreloaderProps) {
  return (
    <div className="pointer-events-auto fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-white text-[#111] [animation:home-preloader-exit_520ms_ease-in-out_2700ms_forwards] motion-reduce:hidden" aria-hidden="true">
      <span className="sr-only">QUASAR PORTFOLIO</span>

      <div className="relative flex h-screen w-screen items-center justify-center px-6 [--image-scale:0.18] [--title-size:clamp(2rem,7vw,7rem)] sm:[--image-scale:0.2] lg:[--image-scale:0.22]">
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-full -translate-y-1/2 pr-[clamp(0.5rem,1.3vw,1.4rem)] text-[length:var(--title-size)] font-black leading-none tracking-[-0.07em] text-[#111] opacity-0 [animation:home-preloader-left_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          QUASAR
        </span>
        <span className="absolute left-1/2 top-1/2 z-10 -translate-y-1/2 pl-[clamp(0.5rem,1.3vw,1.4rem)] text-[length:var(--title-size)] font-black leading-none tracking-[-0.07em] text-[#111] opacity-0 [animation:home-preloader-right_2.7s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          PORTFOLIO
        </span>

        <div className="h-screen w-screen overflow-hidden rounded-[clamp(1.25rem,2.6vw,2.8rem)] opacity-0 shadow-2xl [transform:translateZ(0)_scale(var(--image-scale))] [transform-origin:center] [will-change:transform,opacity,border-radius] [animation:home-preloader-image_3s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          {/* Native img keeps parity with the existing static-export hero asset path. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImagePath} alt="" decoding="async" className="h-full w-full object-cover" />
        </div>
      </div>

      <style jsx>{`
        @keyframes home-preloader-left {
          0% {
            opacity: 0;
            transform: translate3d(-100%, -50%, 0) scale(0.98);
          }
          18%,
          34% {
            opacity: 1;
            transform: translate3d(-100%, -50%, 0) scale(1);
          }
          58%,
          100% {
            opacity: 1;
            transform: translate3d(calc(-100% - min(18vw, 18rem)), -50%, 0) scale(1);
          }
        }

        @keyframes home-preloader-right {
          0% {
            opacity: 0;
            transform: translate3d(0, -50%, 0) scale(0.98);
          }
          18%,
          34% {
            opacity: 1;
            transform: translate3d(0, -50%, 0) scale(1);
          }
          58%,
          100% {
            opacity: 1;
            transform: translate3d(min(18vw, 18rem), -50%, 0) scale(1);
          }
        }

        @keyframes home-preloader-image {
          0%,
          36% {
            border-radius: clamp(1.25rem, 2.6vw, 2.8rem);
            opacity: 0;
            transform: translateZ(0) scale(var(--image-scale));
          }
          54%,
          68% {
            border-radius: clamp(1.25rem, 2.6vw, 2.8rem);
            opacity: 1;
            transform: translateZ(0) scale(var(--image-scale));
          }
          100% {
            border-radius: 0;
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
