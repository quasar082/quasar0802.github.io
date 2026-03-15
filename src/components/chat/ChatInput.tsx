'use client';

import {useState, useCallback, useRef} from 'react';
import {Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {sendMessage} from '@/services/chat';
import {useChatStore} from '@/stores/useChatStore';
import {RATE_LIMIT_COOLDOWN_MS} from '@/types/chat';

/**
 * Chat text input with send button.
 * Styled for glassmorphism pill bar context.
 * Handles rate limiting and disabled state during streaming.
 */
export function ChatInput() {
  const t = useTranslations('Chat');
  const [input, setInput] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const rateLimitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isStreaming || isRateLimited) return;

      sendMessage(trimmed);
      setInput('');
      useChatStore.getState().setOpen(true);

      // Rate limit cooldown
      setIsRateLimited(true);
      if (rateLimitTimer.current) clearTimeout(rateLimitTimer.current);
      rateLimitTimer.current = setTimeout(() => {
        setIsRateLimited(false);
      }, RATE_LIMIT_COOLDOWN_MS);
    },
    [input, isStreaming, isRateLimited],
  );

  const isDisabled = isStreaming || isRateLimited || input.trim() === '';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-4 py-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('placeholder')}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none"
        disabled={isStreaming}
      />
      <button
        type="submit"
        disabled={isDisabled}
        aria-label={t('send')}
        className={`rounded-full p-2 transition-colors ${
          isDisabled
            ? 'cursor-not-allowed opacity-40'
            : 'hover:bg-white/30 hover:text-text-primary'
        } text-accent`}
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}
