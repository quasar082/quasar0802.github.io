# Phase 4: Chatbot Integration - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors can chat with the robot — messages reach the LLM backend via streaming, responses control robot animations via Zustand, and unavailability is handled gracefully with a demo fallback mode.

Requirements: CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06

</domain>

<decisions>
## Implementation Decisions

### Chat UI layout
- Sticky collapsed input bar at bottom of viewport — always visible while scrolling
- Tapping/clicking expands into a bottom-anchored slide-up overlay panel
- Chat bubbles: user messages on the right, robot replies on the left (classic messaging style)
- Panel size: ~400px fixed width on desktop (bottom-right corner), full viewport width on mobile
- Panel slides up from the bottom bar, overlays page content (does not push layout)

### LLM API contract
- Streaming response via SSE/fetch stream — text appears progressively (like ChatGPT)
- Emotion field sent at the START of the stream (first chunk/event) — robot changes animation immediately, text follows
- Frontend sends only the current message — backend manages conversation history on its side
- API key sent in header for authentication
- Endpoint URL configurable (environment variable or config)

### Fallback & error UX
- Robot reacts (sad/confused animation) + friendly error message appears in chat when API is unreachable
- Typing indicator: BOTH robot plays "thinking" animation AND bouncing dots appear in a chat bubble
- 30-second timeout before showing timeout error
- Frontend rate limiting: disable send button with brief cooldown after each message
- Auto-retry once silently on failure (e.g., mid-stream connection drop), then show error if retry also fails
- Mock/demo mode: hardcoded mock responses with random emotions when API is completely down — lets visitors still interact
- On API failure: robot reacts + error shown in chat (not silent switch to demo)

### Chat history
- Stored in localStorage — persists across page refreshes
- Cap at 50 messages — older messages pruned automatically
- First open (empty state): robot greeting message + 2-3 suggested prompt chips (e.g., "What does Quan do?", "Tell me about your projects")
- Clear button in chat header — clears localStorage and resets to greeting state

### Claude's Discretion
- Exact chat bubble styling (colors, border radius, padding) — consistent with lab aesthetic
- Greeting message wording and suggested prompt text
- Mock/demo response content and emotion variety
- Rate limit cooldown duration
- Chat panel animation timing and easing
- Collapsed bar design details (placeholder text, send icon style)
- How emotion field is structured in SSE protocol (e.g., `event: emotion` vs JSON wrapper)
- Robot avatar/icon in chat bubbles (if any)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useRobotStore` (Zustand): Already has `setEmotion()` — chatbot calls this to drive robot animations
- `RobotEmotion` type: `'idle' | 'happy' | 'sad' | 'excited' | 'thinking'` — 5 emotions ready to use
- `RobotCanvas` + `RobotScene`: SSR-safe 3D robot rendering pipeline (dynamic import with ssr: false)
- Ghost button style from Phase 2: transparent + green border, fills on hover — reuse for send button and prompt chips
- Design token system: `--color-accent`, `--color-surface-elevated`, `--color-border`, etc. — use for chat panel styling

### Established Patterns
- Zustand bridges DOM ↔ R3F Canvas boundary — use same pattern for chatbot → robot emotion connection
- `dynamic({ ssr: false })` for browser-only components — may need for streaming fetch if using browser APIs
- Static export mode (`output: 'export'`) — chat is fully client-side, no API routes possible
- `'use client'` directive required for any component with hooks or interactivity

### Integration Points
- `src/app/[lang]/page.tsx`: Currently has emotion demo buttons — remove and replace with chatbot driving emotions
- `src/stores/useRobotStore.ts`: Chat sends `setEmotion(emotion)` when streaming emotion event received
- `src/app/[lang]/layout.tsx`: Chat bar likely mounts here (persistent across page, not tied to a section)
- Environment config: API endpoint URL and API key as env variables

</code_context>

<specifics>
## Specific Ideas

- PROJECT.md specifies LLM response format: `{ answer: string, emotion: string }` — streaming version sends emotion as first event
- "Make Wall-E can love again" — the chatbot IS the robot's voice, making this tagline literal
- Backend handles conversation history — frontend is stateless per-request, only stores display messages locally
- STATE.md blocker: Backend CORS headers must be set for `https://rayquasar18.github.io` before production works
- Emotion demo buttons in page.tsx are explicitly temporary (Phase 3 comment) — chatbot replaces them

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-chatbot-integration*
*Context gathered: 2026-03-14*
