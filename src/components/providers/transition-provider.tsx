'use client';

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {useRouter, usePathname} from '@/lib/i18n/navigation';
import {gsap, ScrollTrigger} from '@/lib/animations/gsap';
import {useLenis} from 'lenis/react';

interface TransitionContextValue {
  startTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  startTransition: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const contentRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const prevPathname = useRef(pathname);

  const startTransition = useCallback(
    (href: string) => {
      if (isTransitioning.current || !contentRef.current) return;
      isTransitioning.current = true;

      // Exit animation: fade out and slide up
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          // Clean up all ScrollTrigger instances from current page
          ScrollTrigger.getAll().forEach((t) => t.kill());
          // Navigate to new route
          router.push(href);
        },
      });
    },
    [router],
  );

  useEffect(() => {
    // No actual route change
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Not a transition-initiated navigation (e.g., first load or preloader)
    if (!isTransitioning.current) return;

    // Reset scroll to top
    lenis?.scrollTo(0, {immediate: true});

    // Enter animation: fade in and slide up from below
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        {opacity: 0, y: 20},
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.05,
          onComplete: () => {
            isTransitioning.current = false;
          },
        },
      );
    }
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={{startTransition}}>
      <div ref={contentRef}>{children}</div>
    </TransitionContext.Provider>
  );
}
