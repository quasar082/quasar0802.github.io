/**
 * Chat type definitions and configuration constants.
 *
 * Shared contracts consumed by the chat UI components, Zustand store,
 * and streaming service. No runtime dependencies on browser APIs --
 * safe to import from any module (SSR or client).
 */

// ---------------------------------------------------------------------------
// Configuration constants
// ---------------------------------------------------------------------------

/** Maximum number of messages retained in the store (FIFO). */
export const MAX_MESSAGES = 50;

/** Minimum cooldown between user sends (ms). */
export const RATE_LIMIT_COOLDOWN_MS = 2000;

/** Abort a stream that produces no events for this long (ms). */
export const STREAM_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Message types
// ---------------------------------------------------------------------------

/** A single chat message. */
export interface ChatMessage {
  /** Unique identifier (generated via `crypto.randomUUID()`). */
  id: string;
  /** Who sent the message. `system` is used for greeting/error notices. */
  role: 'user' | 'assistant' | 'system';
  /** The text content of the message. */
  content: string;
  /** Unix-epoch timestamp (ms) when the message was created. */
  timestamp: number;
}

// ---------------------------------------------------------------------------
// SSE event types (discriminated union)
// ---------------------------------------------------------------------------

/** Progressive text chunk. */
interface SSETextEvent {
  type: 'text';
  content: string;
}

/** Stream-complete signal (optional -- `[DONE]` string is also handled). */
interface SSEDoneEvent {
  type: 'done';
}

/** Discriminated union of all SSE event shapes. */
export type SSEEvent = SSETextEvent | SSEDoneEvent;

// ---------------------------------------------------------------------------
// Store state contract
// ---------------------------------------------------------------------------

/** Full chat state shape including actions (used by the Zustand store). */
export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isStreaming: boolean;
  error: string | null;

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  appendToLastMessage: (chunk: string) => void;
  clearMessages: () => void;
  setOpen: (open: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  resetToGreeting: () => void;
}
