/**
 * Chat streaming service.
 *
 * Handles SSE streaming from the LLM backend, auto-retry on failure,
 * mock/demo mode when the API is unconfigured, and orchestrates
 * store updates for messages.
 *
 * No 'use client' directive -- this is a pure TypeScript module.
 * No browser-only APIs are executed at import time.
 */

import type {SSEEvent} from '@/types/chat';
import {STREAM_TIMEOUT_MS} from '@/types/chat';
import {useChatStore} from '@/stores/useChatStore';

// ---------------------------------------------------------------------------
// Environment configuration
// ---------------------------------------------------------------------------

const LLM_API_URL = process.env.NEXT_PUBLIC_LLM_API_URL ?? '';
const LLM_API_KEY = process.env.NEXT_PUBLIC_LLM_API_KEY ?? '';

/** Whether the real LLM API is configured (both URL and key present). */
export const isApiConfigured = Boolean(LLM_API_URL && LLM_API_KEY);

// ---------------------------------------------------------------------------
// ChatError
// ---------------------------------------------------------------------------

/** Error subclass carrying an optional HTTP status code. */
export class ChatError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ChatError';
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// SSE streaming parser
// ---------------------------------------------------------------------------

/**
 * Async generator that streams SSE events from the LLM backend.
 *
 * Sends a POST request and incrementally parses `data: ...` lines from
 * the response body. Handles partial line buffering and the `[DONE]`
 * sentinel.
 */
async function* streamSSE(
  url: string,
  body: {message: string},
  apiKey: string,
  signal: AbortSignal,
): AsyncGenerator<SSEEvent> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new ChatError(
      `LLM API responded with ${response.status}`,
      response.status,
    );
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split('\n');
      // Last element may be an incomplete line -- keep it in the buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6); // strip "data: " prefix
        if (data === '[DONE]') return;

        try {
          const event = JSON.parse(data) as SSEEvent;
          yield event;
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Mock streaming (demo mode)
// ---------------------------------------------------------------------------

/** Pre-written mock responses. */
const MOCK_RESPONSES: Array<{text: string}> = [
  {
    text: "Quan is an AI Engineer who specializes in NLP, LLM orchestration, multi-agent systems, and RAG architecture. He loves building AI that feels human and works reliably at scale!",
  },
  {
    text: "Quan has worked on some really cool projects! From building intelligent chatbots to designing multi-agent pipelines, he's always pushing the boundaries of what AI can do.",
  },
  {
    text: "The tech stack here includes Next.js, React, TypeScript, Tailwind CSS, and Zustand for state management. On the AI side, it's all about LLMs, RAG, and vector databases!",
  },
  {
    text: "I'm Quan's assistant! I live right here on this portfolio site. I can tell you about his work, his projects, or just chat. I try my best, but sometimes I get a little confused...",
  },
  {
    text: "Hmm, that's a tricky question. Let me think... I'm not sure I have a great answer for that one, but I'm always learning! Maybe ask me something about Quan's projects instead?",
  },
  {
    text: "Oh, I love that question! Quan is passionate about making AI accessible and human-friendly. His motto is 'Make Wall-E can love again' -- how cool is that?",
  },
];

/**
 * Async generator that simulates streaming with random delays.
 * Picks a random mock response and yields it word-by-word.
 */
export async function* mockStreamChat(): AsyncGenerator<SSEEvent> {
  const response =
    MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

  // Stream text word-by-word with random delay
  const words = response.text.split(' ');
  for (const word of words) {
    // Random delay between 50-100ms to simulate streaming feel
    await new Promise((resolve) =>
      setTimeout(resolve, 50 + Math.random() * 50),
    );
    yield {type: 'text', content: word + ' '};
  }
}

// ---------------------------------------------------------------------------
// Module-level abort controller (for cancellation support)
// ---------------------------------------------------------------------------

let currentController: AbortController | null = null;

/** Abort the currently active stream, if any. */
export function abortCurrentStream(): void {
  if (currentController) {
    currentController.abort();
    currentController = null;
  }
}

// ---------------------------------------------------------------------------
// sendMessage orchestrator
// ---------------------------------------------------------------------------

/**
 * Main entry point called by the chat UI.
 *
 * Orchestrates the full send flow:
 * 1. Add user message to store
 * 2. Create placeholder assistant message
 * 3. Stream response (real or mock)
 * 4. Handle errors with auto-retry (1x)
 */
export async function sendMessage(message: string): Promise<void> {
  const chatStore = useChatStore.getState();

  // 1. Add user message
  chatStore.addMessage({role: 'user', content: message});

  // 2. Set streaming state
  useChatStore.getState().setStreaming(true);
  useChatStore.getState().setError(null);

  // 3. Create placeholder assistant message
  useChatStore.getState().addMessage({role: 'assistant', content: ''});

  try {
    if (isApiConfigured) {
      // Real API mode with auto-retry
      await streamWithRetry(message);
    } else {
      // Mock/demo mode
      await consumeStream(mockStreamChat());
    }
  } catch (err) {
    handleStreamError(err);
  } finally {
    useChatStore.getState().setStreaming(false);
    currentController = null;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Attempts to stream from the real API. On first failure, retries once
 * with a fresh AbortController. If retry also fails, throws.
 */
async function streamWithRetry(message: string): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Fresh controller for each attempt
      currentController = new AbortController();
      const signal = AbortSignal.any([
        currentController.signal,
        AbortSignal.timeout(STREAM_TIMEOUT_MS),
      ]);

      const stream = streamSSE(
        LLM_API_URL,
        {message},
        LLM_API_KEY,
        signal,
      );
      await consumeStream(stream);
      return; // Success -- no retry needed
    } catch (err) {
      lastError = err;
      // On first failure, reset assistant message content for retry
      if (attempt === 0) {
        const msgs = useChatStore.getState().messages;
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
          // Placeholder is still empty -- good, retry will fill it
        }
      }
    }
  }

  // Both attempts failed
  throw lastError;
}

/**
 * Consumes an async generator of SSE events, dispatching each to the
 * appropriate store.
 */
async function consumeStream(
  stream: AsyncGenerator<SSEEvent>,
): Promise<void> {
  for await (const event of stream) {
    switch (event.type) {
      case 'text':
        useChatStore.getState().appendToLastMessage(event.content);
        break;
      case 'done':
        return;
    }
  }
}

/**
 * Handles a stream error: adds a system error message, removes empty
 * placeholder, sets error in store.
 */
function handleStreamError(err: unknown): void {
  // Determine error message
  let errorMessage: string;
  if (err instanceof DOMException && err.name === 'TimeoutError') {
    errorMessage = 'Response timed out. Please try again.';
  } else if (err instanceof DOMException && err.name === 'AbortError') {
    // User-initiated cancellation -- not a real error
    return;
  } else {
    errorMessage = 'Something went wrong. Please try again.';
  }

  // Remove empty placeholder assistant message if content is still empty
  const msgs = useChatStore.getState().messages;
  const lastMsg = msgs[msgs.length - 1];
  if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
    useChatStore.setState({
      messages: msgs.slice(0, -1),
    });
  }

  // Add system error message
  useChatStore.getState().addMessage({
    role: 'system',
    content: errorMessage,
  });

  // Set error in store
  useChatStore.getState().setError(errorMessage);
}
