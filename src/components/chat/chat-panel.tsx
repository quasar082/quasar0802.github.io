'use client';

import {useEffect, useRef} from 'react';
import {X, Trash2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {gsap, useGSAP} from '@/lib/animations/gsap';
import {useChatStore} from '@/lib/stores/use-chat-store';
import {isApiConfigured, sendMessage} from '@/lib/services/chat';
import {ChatBubble} from './chat-bubble';
import {TypingIndicator} from './typing-indicator';
import {PromptChips} from './prompt-chips';

/**
 * Transparent glassmorphism chat panel that floats above the input bar.
 * Slides up with GSAP animation on mount; exit animation handled by ChatBar
 * via delayed unmount pattern.
 */
export function ChatPanel({onClose}: {onClose: () => void}) {
  const t = useTranslations('Chat');
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Enter animation on mount
  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      {y: 20, opacity: 0},
      {y: 0, opacity: 1, duration: 0.4, ease: 'power2.out'}
    );
  }, {scope: panelRef});

  // Auto-scroll to bottom on new messages or streaming content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
    }
  }, [messages.length, messages[messages.length - 1]?.content.length]);

  const handleClear = () => {
    useChatStore.getState().resetToGreeting();
  };

  const handlePromptSelect = (prompt: string) => {
    sendMessage(prompt);
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      ref={panelRef}
      style={{opacity: 0, transform: 'translateY(20px)'}}
      className="w-full md:w-[500px] mb-2 flex flex-col overflow-hidden rounded-2xl bg-white/95 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
        <h2 className="font-display text-sm font-medium text-text-primary">
          Robot Assistant
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClear}
            aria-label={t('clear')}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/30 hover:text-text-secondary"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/30 hover:text-text-secondary"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Demo mode notice */}
      {!isApiConfigured && (
        <div className="border-b border-white/20 bg-white/30 px-4 py-1.5 text-center text-xs text-text-muted">
          {t('demoNotice')}
        </div>
      )}

      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 max-h-[60vh] md:max-h-[50vh]"
      >
        {isEmpty ? (
          <>
            {/* Greeting */}
            <div className="flex justify-center px-4 py-1">
              <p className="text-center text-sm italic text-text-muted">
                {t('greeting')}
              </p>
            </div>
            <PromptChips onSelect={handlePromptSelect} />
          </>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
        {isStreaming && <TypingIndicator />}
      </div>
    </div>
  );
}
