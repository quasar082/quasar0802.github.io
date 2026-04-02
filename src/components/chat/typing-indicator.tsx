'use client';

/**
 * Bouncing dots animation shown while the assistant is streaming a response.
 * Uses CSS keyframes instead of framer-motion for lightweight infinite animation.
 * Rendered in a left-aligned bubble container to match assistant message style.
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/40 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block size-2 rounded-full bg-text-muted"
            style={{
              animation: 'bounce-dot 0.6s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
