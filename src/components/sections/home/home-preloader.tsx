'use client';

type HomePreloaderProps = {
  heroImagePath: string;
};

export function HomePreloader({ heroImagePath }: HomePreloaderProps) {
  return (
    <div className="pointer-events-auto fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-white text-[#111] [animation:home-preloader-exit_900ms_ease-in-out_4200ms_forwards] motion-reduce:hidden" aria-hidden="true">
      <span className="sr-only">QUASAR PORTFOLIO</span>

      <div className="relative flex w-full items-center justify-center px-6 [--title-size:clamp(2.75rem,12vw,12rem)]">
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-full -translate-y-1/2 pr-[clamp(0.7rem,2vw,2rem)] text-[length:var(--title-size)] font-black leading-none tracking-[-0.08em] text-[#111] opacity-0 [animation:home-preloader-left_4.2s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          QUASAR
        </span>
        <span className="absolute left-1/2 top-1/2 z-10 -translate-y-1/2 pl-[clamp(0.7rem,2vw,2rem)] text-[length:var(--title-size)] font-black leading-none tracking-[-0.08em] text-[#111] opacity-0 [animation:home-preloader-right_4.2s_cubic-bezier(0.76,0,0.24,1)_forwards]">
          PORTFOLIO
        </span>

        {/* Native img keeps parity with the existing static-export hero asset path. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImagePath}
          alt=""
          decoding="async"
          className="h-[calc(var(--title-size)*0.92)] w-[calc(var(--title-size)*0.72)] rounded-[clamp(1rem,2vw,2rem)] object-cover opacity-0 shadow-2xl [transform:translateZ(0)_scale(0.72)] [transform-origin:center] [will-change:transform,opacity] [animation:home-preloader-image_4.8s_cubic-bezier(0.76,0,0.24,1)_forwards]"
        />
      </div>

      <style jsx>{`
        @keyframes home-preloader-left {
          0% {
            opacity: 0;
            transform: translate3d(-100%, -50%, 0) scale(0.96);
          }
          18%,
          36% {
            opacity: 1;
            transform: translate3d(-100%, -50%, 0) scale(1);
          }
          58%,
          100% {
            opacity: 1;
            transform: translate3d(calc(-100% - min(28vw, 28rem)), -50%, 0) scale(1);
          }
        }

        @keyframes home-preloader-right {
          0% {
            opacity: 0;
            transform: translate3d(0, -50%, 0) scale(0.96);
          }
          18%,
          36% {
            opacity: 1;
            transform: translate3d(0, -50%, 0) scale(1);
          }
          58%,
          100% {
            opacity: 1;
            transform: translate3d(min(28vw, 28rem), -50%, 0) scale(1);
          }
        }

        @keyframes home-preloader-image {
          0%,
          38% {
            opacity: 0;
            transform: translateZ(0) scale(0.72);
          }
          56%,
          70% {
            opacity: 1;
            transform: translateZ(0) scale(1);
          }
          100% {
            opacity: 1;
            transform: translateZ(0) scale(12);
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
