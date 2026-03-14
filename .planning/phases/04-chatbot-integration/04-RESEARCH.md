# Phase 4: Chatbot Integration - Research

**Researched:** 2026-03-14
**Domain:** Client-side chat UI, SSE streaming, Zustand state management, localStorage persistence
**Confidence:** HIGH

## Summary

Phase 4 builds the chatbot that makes the 3D robot come alive. The core technical challenge is implementing a streaming SSE client on a statically exported Next.js site, bridging the streamed LLM responses to both a chat UI and the existing Zustand robot emotion store. The codebase already has the critical integration point -- `useRobotStore.setEmotion()` -- so the chatbot's job is to (1) collect user input, (2) stream responses from the LLM API, (3) parse emotion from the first SSE chunk to drive robot animations, and (4) display the progressive text response in chat bubbles.

No new dependencies are needed. The Fetch API's `ReadableStream` handles SSE parsing without `EventSource` (which cannot send POST requests or custom headers). Zustand's built-in `persist` middleware handles localStorage. The existing design token system and ghost button pattern provide the styling foundation. The i18n system (`next-intl`) already supports adding new namespaces for chat strings.

**Primary recommendation:** Build a dedicated `useChatStore` (Zustand with persist middleware for localStorage) and a pure `streamChat()` service function. Mount the chat panel in the locale layout so it persists across navigation. Use the Fetch API with `getReader()` for SSE streaming -- do NOT use `EventSource` (it cannot send POST bodies or custom headers).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Sticky collapsed input bar at bottom of viewport -- always visible while scrolling
- Tapping/clicking expands into a bottom-anchored slide-up overlay panel
- Chat bubbles: user messages on the right, robot replies on the left (classic messaging style)
- Panel size: ~400px fixed width on desktop (bottom-right corner), full viewport width on mobile
- Panel slides up from the bottom bar, overlays page content (does not push layout)
- Streaming response via SSE/fetch stream -- text appears progressively (like ChatGPT)
- Emotion field sent at the START of the stream (first chunk/event) -- robot changes animation immediately, text follows
- Frontend sends only the current message -- backend manages conversation history on its side
- API key sent in header for authentication
- Endpoint URL configurable (environment variable or config)
- Robot reacts (sad/confused animation) + friendly error message appears in chat when API is unreachable
- Typing indicator: BOTH robot plays "thinking" animation AND bouncing dots appear in a chat bubble
- 30-second timeout before showing timeout error
- Frontend rate limiting: disable send button with brief cooldown after each message
- Auto-retry once silently on failure (e.g., mid-stream connection drop), then show error if retry also fails
- Mock/demo mode: hardcoded mock responses with random emotions when API is completely down -- lets visitors still interact
- On API failure: robot reacts + error shown in chat (not silent switch to demo)
- Stored in localStorage -- persists across page refreshes
- Cap at 50 messages -- older messages pruned automatically
- First open (empty state): robot greeting message + 2-3 suggested prompt chips
- Clear button in chat header -- clears localStorage and resets to greeting state

### Claude's Discretion
- Exact chat bubble styling (colors, border radius, padding) -- consistent with lab aesthetic
- Greeting message wording and suggested prompt text
- Mock/demo response content and emotion variety
- Rate limit cooldown duration
- Chat panel animation timing and easing
- Collapsed bar design details (placeholder text, send icon style)
- How emotion field is structured in SSE protocol (e.g., `event: emotion` vs JSON wrapper)
- Robot avatar/icon in chat bubbles (if any)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAT-01 | User can type messages in a sticky bottom input bar that follows scroll | Chat bar mounts in locale layout, uses `fixed bottom-0` positioning with `safe-area-inset` padding. Collapse/expand via Zustand `isChatOpen` state. |
| CHAT-02 | Messages are sent to external LLM API endpoint via HTTP POST | `streamChat()` service uses Fetch API with POST, sends JSON body `{ message }` with API key in Authorization header. Endpoint URL from env var `NEXT_PUBLIC_LLM_API_URL`. |
| CHAT-03 | LLM response includes answer text + emotion field that controls robot animation state | SSE stream parser reads first chunk for emotion event, calls `useRobotStore.getState().setEmotion(emotion)`. Subsequent chunks append to message text. |
| CHAT-04 | Chat displays typing indicator while waiting for API response | `isStreaming` state in chat store. When true: bouncing dots in chat bubble + robot emotion set to `'thinking'`. |
| CHAT-05 | Chatbot gracefully handles API unavailability with fallback message and default robot emotion | Auto-retry once on failure. If both fail, set robot to `'sad'` and show friendly error message. Mock/demo mode with hardcoded responses available when API is completely unreachable. |
| CHAT-06 | Chat history is maintained in session via Zustand store | `useChatStore` with Zustand `persist` middleware targeting `localStorage`. Messages array capped at 50 with FIFO pruning. Clear button resets to greeting state. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | 5.0.11 | Chat state + persist to localStorage | Already used for robot store; persist middleware built-in |
| react | 19.2.3 | UI components | Already installed |
| next | 16.1.6 | Framework (static export) | Already installed |
| next-intl | 4.8.3 | i18n for chat strings | Already installed and configured |
| framer-motion | 12.36.0 | Panel slide animation, typing dots | Already installed |
| lucide-react | 0.577.0 | Send icon, clear icon, close icon | Already installed |

### Supporting (No New Dependencies)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Fetch API (browser) | Native | SSE streaming via ReadableStream | All LLM API calls -- NOT EventSource |
| TextDecoder (browser) | Native | Decode SSE stream chunks to string | Pair with ReadableStream reader |
| localStorage (browser) | Native | Persist chat messages | Via Zustand persist middleware |
| AbortController (browser) | Native | 30-second timeout + cancel in-flight requests | Every fetch call |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fetch + ReadableStream | EventSource | EventSource cannot do POST, cannot send custom headers (API key). Fetch is the only viable option for this use case. |
| Zustand persist | Manual localStorage | Persist middleware handles serialization, hydration, and SSR safety automatically. No reason to hand-roll. |
| Separate chat state lib | @tanstack/query | Overkill for a single endpoint with streaming. Zustand already in the project. |

**Installation:**
```bash
# No new packages needed. All dependencies already installed.
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── chat/
│       ├── ChatBar.tsx            # Collapsed input bar (fixed bottom)
│       ├── ChatPanel.tsx          # Expanded overlay panel
│       ├── ChatBubble.tsx         # Single message bubble (user or robot)
│       ├── ChatInput.tsx          # Text input + send button
│       ├── TypingIndicator.tsx    # Bouncing dots indicator
│       └── PromptChips.tsx        # Suggested prompt buttons
├── services/
│   └── chat.ts                   # streamChat(), mockChat() -- pure functions
├── stores/
│   ├── useRobotStore.ts          # Existing -- setEmotion() called by chat
│   └── useChatStore.ts           # NEW -- messages, isOpen, isStreaming
├── types/
│   ├── robot.ts                  # Existing
│   └── chat.ts                   # NEW -- ChatMessage, ChatState types
└── app/
    └── [lang]/
        └── layout.tsx            # Mount <ChatBar /> here (persists across nav)
```

### Pattern 1: Fetch-Based SSE Streaming
**What:** Use `fetch()` with `ReadableStream.getReader()` to parse SSE responses chunk by chunk.
**When to use:** When the SSE endpoint requires POST method or custom headers (both true here).
**Why not EventSource:** `EventSource` only supports GET requests and cannot set custom headers. Since the API requires POST with an Authorization header, `fetch` is the only option.

```typescript
// src/services/chat.ts
async function* streamSSE(
  url: string,
  body: { message: string },
  apiKey: string,
  signal: AbortSignal,
): AsyncGenerator<SSEEvent> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new ChatError(`API error: ${response.status}`, response.status);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          yield JSON.parse(data) as SSEEvent;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
```

### Pattern 2: Zustand Store with Persist Middleware
**What:** Chat store that automatically persists messages to localStorage and hydrates on page load.
**When to use:** For all chat state (messages, open/close, greeting state).

```typescript
// src/stores/useChatStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  emotion?: RobotEmotion;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isStreaming: boolean;
  // ... actions
}

const MAX_MESSAGES = 50;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      isStreaming: false,
      addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) =>
        set((state) => {
          const messages = [
            ...state.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
          ];
          // Cap at MAX_MESSAGES -- prune oldest
          return { messages: messages.slice(-MAX_MESSAGES) };
        }),
      appendToLastMessage: (chunk: string) =>
        set((state) => {
          const msgs = [...state.messages];
          const last = msgs[msgs.length - 1];
          if (last?.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
          }
          return { messages: msgs };
        }),
      clearMessages: () => set({ messages: [] }),
      setOpen: (open: boolean) => set({ isOpen: open }),
      setStreaming: (streaming: boolean) => set({ isStreaming: streaming }),
    }),
    {
      name: 'rayquasar-chat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        // Do NOT persist isOpen, isStreaming -- transient UI state
      }),
    },
  ),
);
```

**Critical detail:** The `partialize` option ensures only `messages` are persisted. Transient state like `isOpen` and `isStreaming` must NOT be persisted -- they should reset to defaults on page load.

### Pattern 3: Robot Emotion Bridge (Zustand Cross-Store)
**What:** Chat service calls `useRobotStore.getState().setEmotion()` to drive robot animations from streamed LLM responses.
**When to use:** When processing the first SSE chunk that contains the emotion field.

```typescript
// In the chat send handler:
import { useRobotStore } from '@/stores/useRobotStore';

// When streaming starts:
useRobotStore.getState().setEmotion('thinking');

// When emotion event arrives (first SSE chunk):
useRobotStore.getState().setEmotion(emotionFromStream);

// On error:
useRobotStore.getState().setEmotion('sad');

// When stream completes and user is idle:
// Keep the emotion from the response -- don't reset to idle
```

**Key insight:** Use `getState()` (not the hook) because this runs in a service function outside React component context. This is the same pattern already used by the emotion demo buttons in `page.tsx`.

### Pattern 4: Layout-Level Chat Mount
**What:** Mount the chat component in the locale layout so it persists across page navigation.
**When to use:** Always -- the chat must survive route changes within the app.

```typescript
// src/app/[lang]/layout.tsx
import { ChatBar } from '@/components/chat/ChatBar';

export default async function LocaleLayout({ children, params }) {
  // ... existing code ...
  return (
    <html lang={lang}>
      <body className={/* existing classes */}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Header />
          <main className="pt-16">{children}</main>
          <ChatBar />  {/* Fixed position, always visible */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Important:** `ChatBar` must be a client component (`'use client'`). It can be imported directly in the server layout because it will be rendered client-side. However, if the chat uses browser APIs at the module level (unlikely since Zustand handles hydration), wrap with `dynamic({ ssr: false })`.

### Pattern 5: SSE Protocol Design (Claude's Discretion)
**What:** The structure of SSE events between frontend and backend.
**Recommendation:** Use a JSON wrapper in `data:` fields with a `type` discriminator.

```
// First event -- emotion
data: {"type":"emotion","emotion":"happy"}

// Subsequent events -- text chunks
data: {"type":"text","content":"Hello! "}
data: {"type":"text","content":"I'm the robot assistant. "}
data: {"type":"text","content":"How can I help you?"}

// Final event
data: [DONE]
```

**Why this over separate `event:` types:** Simpler to parse with a single code path. The `event:` field in SSE requires separate event listeners (only relevant with EventSource, which we cannot use). With fetch streaming, we parse all lines the same way and dispatch on the `type` field.

### Anti-Patterns to Avoid
- **Using `EventSource`:** Cannot POST, cannot set custom headers. Use `fetch` with `ReadableStream`.
- **Persisting transient state:** Do NOT persist `isOpen`, `isStreaming`, or `error` state to localStorage. Only persist `messages`.
- **Creating a single mega-store:** Keep `useChatStore` separate from `useRobotStore`. They have different lifecycle and persistence needs. Cross-store communication via `getState()`.
- **Mounting chat inside page.tsx:** Would remount on route changes, losing panel state. Mount in layout.
- **Using `useEffect` for streaming logic:** Streaming should be triggered by user action (send button), not by component mount. Use an action function in the store or a standalone service.
- **Blocking the UI during streaming:** Use `requestAnimationFrame` or natural React batching for chunk updates. React 19 automatic batching handles this well.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage persistence | Custom save/load/serialize logic | Zustand `persist` middleware | Handles hydration timing, SSR safety, serialization, partialize, versioning |
| SSE line parsing | Custom line splitter | Standard `\n`-split buffer pattern (shown above) | SSE spec is simple but buffer management has edge cases (partial chunks) |
| Unique message IDs | Counter or timestamp-based | `crypto.randomUUID()` | Cryptographically unique, built into all modern browsers, no collision risk |
| Chat panel animation | Manual CSS transitions | `framer-motion` `AnimatePresence` + `motion.div` | Already installed, handles mount/unmount animations cleanly |
| Rate limiting | Custom timer logic | Simple `setTimeout` + disabled state | Keep it minimal -- just disable the send button for N seconds after send |
| Abort/timeout | Manual `setTimeout` + abort | `AbortController` with `AbortSignal.timeout(30000)` | `AbortSignal.timeout()` is the modern built-in pattern, cleaner than manual setTimeout |

**Key insight:** The streaming SSE parser is the one piece of "infrastructure" code in this phase, but it is straightforward with the buffer pattern shown above. Everything else is standard React + Zustand.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Persist Middleware
**What goes wrong:** Zustand persist loads from localStorage asynchronously. On first render, the store has default state (empty messages). After hydration, it has persisted state. This causes a React hydration mismatch in SSR/SSG contexts.
**Why it happens:** Next.js statically renders with default state, but the client has persisted state.
**How to avoid:** Since `output: 'export'`, the page is static HTML. The chat component is client-only with `'use client'`. The persist middleware's `onRehydrateStorage` callback or `skipHydration` option can delay rendering until hydration completes. Alternatively, accept the flash (empty -> populated) since the chat panel starts collapsed anyway.
**Warning signs:** Console warnings about hydration mismatch, chat messages flickering on load.
**Recommended approach:** The chat bar renders collapsed by default. Messages only appear when the panel opens. By the time a user opens the panel, hydration will have long completed. No special handling needed.

### Pitfall 2: Partial SSE Chunks
**What goes wrong:** A single `reader.read()` call may return a partial line (e.g., `data: {"type":"te` without the closing `}`). Trying to JSON.parse a partial line crashes.
**Why it happens:** TCP/HTTP chunking does not respect SSE line boundaries.
**How to avoid:** Always buffer incoming data and only process complete lines (terminated by `\n`). The buffer pattern in the code example above handles this correctly by keeping the last (potentially incomplete) line in the buffer.
**Warning signs:** `SyntaxError: Unexpected end of JSON input` in console.

### Pitfall 3: Memory Leak from Uncancelled Streams
**What goes wrong:** User navigates away or closes the chat while a stream is active. The stream keeps reading, consuming memory and bandwidth.
**Why it happens:** `ReadableStream.getReader()` holds a lock on the stream. If not cancelled, it stays open.
**How to avoid:** Pass an `AbortSignal` to `fetch()`. Cancel via `AbortController.abort()` when: (a) component unmounts, (b) user sends a new message while previous is streaming, (c) user closes chat panel.
**Warning signs:** Network tab shows open connection after chat is closed.

### Pitfall 4: Race Condition on Rapid Message Sends
**What goes wrong:** User sends multiple messages quickly. Multiple streams run simultaneously, interleaving chunks into the same message bubble.
**Why it happens:** No mutex or previous-stream cancellation.
**How to avoid:** (1) Disable send button while `isStreaming` is true (user decision: rate limiting). (2) Abort previous stream before starting new one. (3) Store an `abortController` ref that is replaced on each send.
**Warning signs:** Garbled text in chat bubbles, wrong emotions.

### Pitfall 5: `NEXT_PUBLIC_` Prefix Required for Client-Side Env Vars
**What goes wrong:** Environment variable is set but reads as `undefined` in the browser.
**Why it happens:** Next.js only inlines env vars with `NEXT_PUBLIC_` prefix into client bundles.
**How to avoid:** Name the variables `NEXT_PUBLIC_LLM_API_URL` and `NEXT_PUBLIC_LLM_API_KEY`. For static export, these must be set at BUILD time (not runtime).
**Warning signs:** API calls go to `undefined/chat`, 404 errors.

### Pitfall 6: CORS Blocking in Production
**What goes wrong:** Chat works on localhost but fails on `rayquasar18.github.io`.
**Why it happens:** Backend CORS headers not configured for the production origin.
**How to avoid:** This is a known blocker from STATE.md. Backend must set `Access-Control-Allow-Origin: https://rayquasar18.github.io` and `Access-Control-Allow-Headers: Authorization, Content-Type`. For development, the mock/demo mode bypasses this entirely.
**Warning signs:** CORS error in console, opaque response.

### Pitfall 7: Static Export Cannot Use API Routes
**What goes wrong:** Developer tries to create `app/api/chat/route.ts` for a proxy endpoint.
**Why it happens:** Habit from full Next.js apps. `output: 'export'` mode does not support API routes.
**How to avoid:** All API calls must be direct from browser to external LLM endpoint. No server-side proxy is possible. This is why the API key is sent from the client (in a header).
**Warning signs:** Build error: "API Routes are not supported with static export".

## Code Examples

### Environment Variable Configuration
```typescript
// src/services/chat.ts
const LLM_API_URL = process.env.NEXT_PUBLIC_LLM_API_URL ?? '';
const LLM_API_KEY = process.env.NEXT_PUBLIC_LLM_API_KEY ?? '';

// Validate at module level -- fail fast
export const isApiConfigured = Boolean(LLM_API_URL && LLM_API_KEY);
```

### AbortSignal.timeout() for 30-Second Timeout
```typescript
// Modern pattern -- combines user-controlled abort with timeout
const controller = new AbortController();
const timeoutSignal = AbortSignal.timeout(30_000);

// Combine signals: abort on either user cancel OR timeout
const signal = AbortSignal.any([controller.signal, timeoutSignal]);
// Note: AbortSignal.any() is available in all modern browsers (Chrome 116+, Firefox 124+, Safari 17.4+)
```

### Mock/Demo Mode Service
```typescript
// src/services/chat.ts
const MOCK_RESPONSES: Array<{ text: string; emotion: RobotEmotion }> = [
  { text: "Hi! I'm Quan's robot assistant. I'm currently in demo mode, but I can still chat!", emotion: 'happy' },
  { text: "Quan is an AI Engineer who specializes in NLP, LLM systems, and multi-agent architectures.", emotion: 'excited' },
  { text: "I'm not connected to my brain right now, but I'm still happy to see you!", emotion: 'happy' },
  // ... more varied responses
];

export async function* mockStreamChat(): AsyncGenerator<SSEEvent> {
  const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

  // Simulate emotion arriving first
  yield { type: 'emotion', emotion: response.emotion };

  // Simulate streaming text word by word
  const words = response.text.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 50));
    yield { type: 'text', content: word + ' ' };
  }
}
```

### Chat Panel Slide Animation (framer-motion)
```typescript
// Using AnimatePresence for mount/unmount animation
import { AnimatePresence, motion } from 'framer-motion';

function ChatPanel({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-14 right-0 z-40 w-full sm:right-4 sm:w-[400px]"
          // Note: use pb-[env(safe-area-inset-bottom)] for mobile safe area
        >
          {/* Panel content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Auto-Scroll to Bottom on New Messages
```typescript
// Pattern: useRef + scrollIntoView on message list changes
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages.length, lastMessageContent]);

// At the bottom of the messages container:
<div ref={messagesEndRef} />
```

### i18n Integration for Chat Strings
```json
// Add to src/messages/en.json
{
  "Chat": {
    "placeholder": "Type a message...",
    "send": "Send",
    "clear": "Clear chat",
    "close": "Close",
    "greeting": "Hey there! I'm Quan's robot assistant. Ask me anything about his work!",
    "promptChip1": "What does Quan do?",
    "promptChip2": "Tell me about your projects",
    "promptChip3": "What tech do you use?",
    "errorGeneric": "Oops, I couldn't process that. Let me try again...",
    "errorTimeout": "That took too long. Please try again.",
    "errorOffline": "I can't reach my brain right now. Let me try demo mode!",
    "demoNotice": "Demo mode -- responses are pre-written"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `EventSource` for SSE | `fetch` + `ReadableStream` | ~2020+ | Required for POST + custom headers; EventSource is GET-only |
| Manual localStorage with JSON.parse/stringify | Zustand `persist` middleware | Zustand 3.x+ (2021) | Handles SSR, hydration timing, partialize |
| `setTimeout` + `clearTimeout` for fetch timeout | `AbortSignal.timeout(ms)` | Chrome 103 / 2022 | Cleaner API, no manual cleanup |
| Multiple abort signals merged manually | `AbortSignal.any([...])` | Chrome 116 / Safari 17.4 / 2023 | Combine user abort + timeout cleanly |
| React state batching with unstable_batchedUpdates | React 19 automatic batching | React 18+ (2022) | All state updates are automatically batched, even in async callbacks |
| Framer Motion package name `framer-motion` | `motion/react` import path available | Late 2024 | Both import paths work; project uses `framer-motion` package which re-exports `motion/react` |

**Deprecated/outdated:**
- `EventSource` for any use case requiring POST or custom headers -- use `fetch` + `ReadableStream`
- Manual React batching (`unstable_batchedUpdates`) -- React 19 does this automatically

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test runner configured |
| Config file | None -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | `npm run test:build` (build-only verification) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAT-01 | Sticky input bar visible at bottom | manual-only | Visual verification in browser | N/A |
| CHAT-02 | POST to LLM endpoint, response received | smoke | `npm run test:build` (verifies compilation) | N/A |
| CHAT-03 | Emotion from response controls robot animation | manual-only | Visual verification: send message, observe robot | N/A |
| CHAT-04 | Typing indicator shown during streaming | manual-only | Visual verification in browser | N/A |
| CHAT-05 | Fallback on API failure | smoke | Disconnect network, verify fallback message | N/A |
| CHAT-06 | Chat history persists via localStorage | manual-only | Refresh page, verify messages remain | N/A |

**Justification for manual-only:** No test framework is installed. Setting up Jest/Vitest with R3F mocking, Zustand store testing, and fetch mocking would be a significant investment that exceeds phase scope. The primary verification is `npm run test:build` (build succeeds) plus manual browser testing.

### Sampling Rate
- **Per task commit:** `npm run test:build` (ensures no TypeScript errors, no build crashes)
- **Per wave merge:** Manual browser test (send message, observe robot, check persistence)
- **Phase gate:** Full build green + all 6 manual verification scenarios pass

### Wave 0 Gaps
- No test framework installed -- defer to a future testing phase
- Build verification (`npm run test:build`) is the only automated check available
- Manual test scenarios documented above serve as the verification plan

## Open Questions

1. **Backend SSE Protocol Exact Format**
   - What we know: Response includes `answer` (text) and `emotion` (string). Emotion should arrive first in stream.
   - What's unclear: Exact SSE event format from the backend. Is it `data: {"type":"emotion","emotion":"happy"}` or `event: emotion\ndata: happy`? Or does the entire response come as a single JSON `{ answer, emotion }`?
   - Recommendation: Design the frontend parser to handle the JSON wrapper format (recommended in this research). Coordinate with backend to match. The mock/demo mode uses this format, so when the real backend is ready, it just needs to match.

2. **CORS Configuration Status**
   - What we know: STATE.md flags this as a blocker -- backend must set CORS headers for `https://rayquasar18.github.io`.
   - What's unclear: Whether the backend is configured yet.
   - Recommendation: Build with mock/demo mode as the default fallback. The chat is fully functional in demo mode. Real API integration is a configuration change (set env vars), not a code change.

3. **API Key Security in Static Export**
   - What we know: `NEXT_PUBLIC_` vars are inlined into the JavaScript bundle at build time. The API key will be visible in the client-side code.
   - What's unclear: Whether this is acceptable for the LLM backend's security model.
   - Recommendation: Proceed as designed (API key in header). The key is for a personal portfolio's chatbot -- the risk is limited. If stronger security is needed later, a thin proxy (Cloudflare Worker, Vercel Edge Function) can be added.

4. **`AbortSignal.any()` Browser Support**
   - What we know: Supported in Chrome 116+, Firefox 124+, Safari 17.4+.
   - What's unclear: Whether the target audience uses older browsers.
   - Recommendation: Use it. These browser versions are from 2023-2024. For the rare case of unsupported browsers, the fallback is a simple manual combination pattern. A portfolio site can reasonably target modern browsers.

## Sources

### Primary (HIGH confidence)
- Zustand 5.0.11 `persist` middleware types -- verified from `node_modules/zustand/middleware/persist.d.ts` (installed locally)
- `useRobotStore.ts` -- verified existing store pattern with `setEmotion()` and `getState()` usage
- `src/types/robot.ts` -- verified `RobotEmotion` type: `'idle' | 'happy' | 'sad' | 'excited' | 'thinking'`
- `src/app/[lang]/layout.tsx` -- verified layout structure for chat mount point
- `next.config.ts` -- verified `output: 'export'` (static site, no API routes)
- `package.json` -- verified all dependency versions (no new deps needed)
- `src/app/globals.css` -- verified design token system (--color-accent, --color-surface-elevated, etc.)
- `src/messages/en.json` -- verified i18n namespace structure for adding Chat namespace
- `src/app/[lang]/page.tsx` -- verified emotion demo buttons (lines 30-43) to be removed

### Secondary (MEDIUM confidence)
- Fetch API ReadableStream + TextDecoder for SSE parsing -- well-documented browser API, standard pattern used across LLM frontend implementations
- `AbortSignal.timeout()` and `AbortSignal.any()` browser support -- based on MDN compatibility data
- React 19 automatic batching for streaming state updates -- documented React feature since React 18

### Tertiary (LOW confidence)
- None -- all findings verified from local codebase or established browser APIs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and verified in node_modules
- Architecture: HIGH -- patterns verified against existing codebase (Zustand store, layout structure, SSR boundary)
- Pitfalls: HIGH -- derived from concrete codebase constraints (static export, CORS blocker in STATE.md, env var prefix requirement)
- SSE protocol: MEDIUM -- recommended format is standard but actual backend format unknown; mock mode makes this testable independently

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable -- no fast-moving dependencies)
