'use client';

import type {ChatMessage} from '@/lib/types/chat';

/**
 * Individual message bubble.
 * - user: right-aligned, accent-colored
 * - assistant: left-aligned, surface-overlay background
 * - system: center-aligned, muted italic text, no bubble
 */
export function ChatBubble({message}: {message: ChatMessage}) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center px-4 py-1">
        <p className="text-center text-sm italic text-text-muted">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 ${
          isUser
            ? 'rounded-2xl rounded-br-sm bg-greige-900 text-white'
            : 'rounded-2xl rounded-bl-sm bg-white/40 text-text-primary'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
