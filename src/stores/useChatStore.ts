/**
 * Zustand store for chat state.
 *
 * Persists only the `messages` array to localStorage so conversation
 * history survives page reloads. Transient UI flags (`isOpen`,
 * `isStreaming`, `error`) reset to defaults on every page load.
 *
 * No 'use client' directive needed: `create` is a plain function call,
 * not a React hook. The store becomes a hook only when consumed inside
 * a component.
 */

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import type {ChatMessage, ChatState} from '@/types/chat';
import {MAX_MESSAGES} from '@/types/chat';

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // ----- initial state -----
      messages: [],
      isOpen: false,
      isStreaming: false,
      error: null,

      // ----- actions -----

      addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) =>
        set((state) => {
          const newMessage: ChatMessage = {
            ...msg,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };
          const updated = [...state.messages, newMessage];
          // FIFO pruning -- keep only the most recent MAX_MESSAGES entries
          return {messages: updated.slice(-MAX_MESSAGES)};
        }),

      appendToLastMessage: (chunk: string) =>
        set((state) => {
          const msgs = [...state.messages];
          // Walk backwards to find the last assistant message
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              msgs[i] = {...msgs[i], content: msgs[i].content + chunk};
              return {messages: msgs};
            }
          }
          // No assistant message found -- no-op
          return state;
        }),

      clearMessages: () => set({messages: []}),

      setOpen: (open: boolean) => set({isOpen: open}),

      setStreaming: (streaming: boolean) => set({isStreaming: streaming}),

      setError: (error: string | null) => set({error}),

      resetToGreeting: () => set({messages: [], error: null}),
    }),
    {
      name: 'rayquasar-chat',
      storage: createJSONStorage(() => localStorage),
      // Persist ONLY messages -- isOpen, isStreaming, error are transient
      partialize: (state) => ({messages: state.messages}),
    },
  ),
);
