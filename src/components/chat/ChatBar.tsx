'use client';

import {AnimatePresence} from 'framer-motion';
import {useChatStore} from '@/stores/useChatStore';
import {abortCurrentStream} from '@/services/chat';
import {ChatPanel} from './ChatPanel';
import {ChatInput} from './ChatInput';

/**
 * Always-visible floating glassmorphism chat bar at the bottom center of the viewport.
 *
 * The input is always visible. When the user sends a message, the ChatPanel
 * slides up above the bar with AnimatePresence.
 *
 * Mounted at layout level so it persists across page navigation.
 */
export function ChatBar() {
  const isOpen = useChatStore((s) => s.isOpen);
  const messages = useChatStore((s) => s.messages);

  const showPanel = isOpen && messages.length > 0;

  const handleCollapse = () => {
    useChatStore.getState().setOpen(false);
    abortCurrentStream();
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex flex-col items-center pb-[env(safe-area-inset-bottom)]">
      {/* Chat panel (above bar) */}
      <AnimatePresence>
        {showPanel && <ChatPanel onClose={handleCollapse} />}
      </AnimatePresence>

      {/* Always-visible floating input bar */}
      <div className="w-full px-4 pb-4 md:w-[500px] md:px-0">
        <div className="rounded-full bg-white/60 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
