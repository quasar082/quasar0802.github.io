---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Complete Redesign
status: active
stopped_at: null
last_updated: "2026-03-15"
last_activity: 2026-03-15 — Milestone v2.0 started, defining requirements
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-15)

**Core value:** The interactive 3D robot chatbot — a cute robot that responds with emotions and animations based on LLM-generated answers — must work flawlessly
**Current focus:** Defining requirements for v2.0 Complete Redesign

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-03-15 — Milestone v2.0 started

## Accumulated Context

### Decisions

- Phase 1 (reset): Old codebase deleted entirely — starting fresh with Next.js 16 + TypeScript + Tailwind CSS v4
- Phase 2: Use `app/[lang]/` + `generateStaticParams` for i18n — no middleware (static export incompatible)
- Phase 2 (02-01): Saprona for display/headings, MarlinGeoSQ for body text
- Phase 3: Use `dynamic({ ssr: false })` for all R3F imports — prevents SSR build crash
- Phase 3: Zustand is the only correct bridge across R3F Canvas boundary
- Phase 4: SSE parser uses async generator pattern
- Phase 4: ChatBar renders collapsed button or expanded ChatPanel
- v2.0: White minimalist theme replaces dark lab aesthetic (Dennis Snellenberg-inspired)
- v2.0: GSAP + ScrollTrigger + Lenis for animations, Framer Motion retained for component-level
- v2.0: Robot moves to Section 2, hero gets photo + oversized marquee name
- v2.0: Chat bar redesigned as always-visible slim transparent centered floating bar
- v2.0: Intro preloader sequence retained (black → text → curtain reveal)

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 3] `.glb` animation clip names unknown until file is provided
- [Phase 4] LLM backend CORS headers must be set before production
- [Phase 8] `next-mdx-remote` React 19 peer dep compatibility must be verified

## Session Continuity

Last session: 2026-03-15
Stopped at: Defining v2.0 requirements
Resume: v2.0 milestone started. Requirements and roadmap being defined.
