'use client';

import {useRef, useState, useEffect, useCallback} from 'react';
import {gsap} from '@/lib/gsap';
import {useLenis} from 'lenis/react';
import {useChatStore} from '@/stores/useChatStore';
import {abortCurrentStream} from '@/services/chat';
import {ChatPanel} from './ChatPanel';
import {ChatInput} from './ChatInput';

/**
 * Always-visible floating glassmorphism chat bar at the bottom center of the viewport.
 *
 * The input is always visible. When the user sends a message, the ChatPanel
 * slides up above the bar with GSAP animation and delayed unmount pattern.
 *
 * Hides on scroll-down, reveals on scroll-up (mirrors header behavior).
 *
 * Mounted at layout level so it persists across page navigation.
 */
export function ChatBar() {
  const isOpen = useChatStore((s) => s.isOpen);
  const messages = useChatStore((s) => s.messages);

  const showPanel = isOpen && messages.length > 0;
  const [shouldRender, setShouldRender] = useState(false);
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Scroll hide/show state
  const lastDirectionChangeY = useRef(0);
  const barVisible = useRef(true);
  const prevDirection = useRef<1 | -1 | 0>(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Scroll hide/show logic (mirrors header)
  useLenis((lenis) => {
    if (!barRef.current) return;

    // Keep visible when chat panel is open
    if (showPanel) {
      if (!barVisible.current) {
        const dur = reducedMotion.current ? 0 : 0.4;
        gsap.to(barRef.current, {y: '0%', duration: dur, ease: 'power3.inOut'});
        barVisible.current = true;
      }
      return;
    }

    const scrollY = lenis.animatedScroll;
    const direction = lenis.direction as 1 | -1 | 0;
    const dur = reducedMotion.current ? 0 : 0.4;

    // Always show near top
    if (scrollY < 80) {
      if (!barVisible.current) {
        gsap.to(barRef.current, {y: '0%', duration: dur, ease: 'power3.inOut'});
        barVisible.current = true;
      }
      lastDirectionChangeY.current = scrollY;
      prevDirection.current = direction;
      return;
    }

    // Detect direction change
    if (direction !== prevDirection.current && direction !== 0) {
      lastDirectionChangeY.current = scrollY;
      prevDirection.current = direction;
    }

    // Scrolling down → hide after 80px
    if (direction === 1 && barVisible.current) {
      if (scrollY - lastDirectionChangeY.current > 80) {
        gsap.to(barRef.current, {y: '100%', duration: dur, ease: 'power3.inOut'});
        barVisible.current = false;
      }
    }

    // Scrolling up → reveal after 20px
    if (direction === -1 && !barVisible.current) {
      if (lastDirectionChangeY.current - scrollY > 20) {
        gsap.to(barRef.current, {y: '0%', duration: dur, ease: 'power3.inOut'});
        barVisible.current = true;
      }
    }
  }, [showPanel]);

  // Delayed unmount: when showPanel goes false, animate out then unmount
  useEffect(() => {
    if (showPanel) {
      setShouldRender(true);
    } else if (shouldRender && panelWrapperRef.current) {
      // Exit animation before unmount
      gsap.to(panelWrapperRef.current, {
        y: 20, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => setShouldRender(false),
      });
    }
  }, [showPanel, shouldRender]);

  const handleCollapse = useCallback(() => {
    useChatStore.getState().setOpen(false);
    abortCurrentStream();
  }, []);

  return (
    <div ref={barRef} className="fixed bottom-0 inset-x-0 z-50 flex flex-col items-center pb-[env(safe-area-inset-bottom)]">
      {/* Chat panel (above bar) - wrapped for exit animation */}
      {shouldRender && (
        <div ref={panelWrapperRef}>
          <ChatPanel onClose={handleCollapse} />
        </div>
      )}

      {/* Always-visible floating input bar */}
      <div className="w-full px-4 pb-6 md:w-[500px] md:px-0">
        <div className="rounded-full bg-white/60 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
