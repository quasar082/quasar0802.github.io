# RayQuasar Portfolio

## What This Is

A personal portfolio website for an AI Engineer specializing in NLP, LLM, AI architecture design, multi-agent systems, and RAG pipelines. The site features an interactive 3D robot character that users can chat with via a chatbot powered by an LLM backend, showcasing both the owner's personality and technical capabilities. The motto is "Make Wall-E can love again <3".

## Core Value

The interactive 3D robot chatbot experience — a cute robot that responds with emotions and animations based on LLM-generated answers — must work flawlessly. This is the centerpiece that differentiates this portfolio from all others and demonstrates AI engineering skills in action.

## Current Milestone: v2.0 Complete Redesign

**Goal:** Redesign the entire portfolio with a white minimalist aesthetic inspired by Dennis Snellenberg, featuring GSAP/Lenis animations, intro preloader, restructured sections, and a centered floating chat bar.

**Target features:**
- Intro preloader sequence (black → text reveals → curtain transition to hero)
- Full-viewport hero with centered photo, oversized marquee name, minimal nav
- 3D robot moved to dedicated Section 2 (not hero)
- Always-visible slim transparent floating chat bar, centered at bottom
- All content sections (About, Projects, Blog, Footer) redesigned for light minimalist theme
- GSAP + ScrollTrigger + Lenis smooth scroll animation system
- Text reveal animations, page transitions, scroll-triggered effects
- i18n (Vietnamese + English) preserved
- Full SEO + performance optimization

## Requirements

### Validated

<!-- Shipped and confirmed valuable. v1.0 milestones. -->

- ✓ Next.js project structure with TypeScript + Tailwind CSS v4 — v1.0 Phase 1
- ✓ i18n routing (app/[lang]/) with next-intl, language switcher — v1.0 Phase 2
- ✓ 3D robot with React Three Fiber, emotion-based animations, Zustand state — v1.0 Phase 3
- ✓ LLM chatbot with SSE streaming, mock/demo mode, emotion control — v1.0 Phase 4

### Active

<!-- Current scope. Building toward these. -->

- [ ] White minimalist theme replacing dark lab aesthetic (Dennis Snellenberg-inspired)
- [ ] Intro preloader with text sequence and curtain reveal transition
- [ ] Full-viewport hero section with photo, oversized marquee name, role text
- [ ] 3D robot in dedicated Section 2 (moved from hero)
- [ ] Always-visible slim transparent floating chat bar, centered bottom
- [ ] GSAP + ScrollTrigger + Lenis animation system
- [ ] About section — storytelling format, light theme, scroll-triggered reveals
- [ ] Projects section — card grid + detail pages, minimalist design
- [ ] Blog system — full MDX with tags, search, TOC, syntax highlighting, series
- [ ] Footer with social links, minimalist style
- [ ] Full SEO — meta tags, OG image, sitemap, structured data
- [ ] Responsive design — mobile, tablet, desktop
- [ ] Performance optimization — code splitting, lazy loading, Lighthouse

### Out of Scope

- Dark theme / theme toggle — white minimalist is the brand identity for v2
- Contact form — links only, no backend email service needed
- Real-time chat (WebSocket) — standard request/response sufficient
- Mobile app — web only
- CMS / admin panel — blog posts managed as .md files in repo
- User authentication — public portfolio, no login needed

## Context

- **Existing codebase:** Next.js 16 with TypeScript, Tailwind CSS v4, App Router. i18n routing, 3D robot subsystem, and chatbot infrastructure already built in v1.0 (Phases 1-4).
- **Design reference:** dennissnellenberg.com — white/neutral background, oversized sans-serif typography, full-viewport hero with photo + marquee name, smooth scroll, text reveal animations, minimal nav
- **3D Model:** Placeholder dragon model currently in use. Owner will provide .glb/.gltf of a cute robot character later.
- **Backend API:** LLM chatbot API TBD. Mock/demo mode already implemented.
- **Hero photo:** Placeholder image for now — owner will provide professional photo later.
- **Target audience:** Recruiters and tech companies looking for AI engineers
- **Owner expertise:** AI Engineer — NLP, LLM, AI architecture, multi-agent systems, agentic AI, RAG architect

## Constraints

- **Tech stack**: Next.js 16, React Three Fiber for 3D, TypeScript, Tailwind CSS v4, GSAP + Lenis
- **Animation**: GSAP + ScrollTrigger for scroll/page transitions, Lenis for smooth scroll, Framer Motion retained for component-level animations
- **Performance**: 3D model lazy-loads, page usable under 3s without 3D, Lighthouse optimized
- **Code quality**: Production-grade — this portfolio IS the resume
- **3D dependency**: Robot model file TBD — build with placeholder
- **API dependency**: LLM backend endpoint TBD — mock/demo mode exists
- **i18n**: Vietnamese and English with next-intl (existing)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark-only theme | Matches lab/tech aesthetic, simpler implementation | ⚠️ Revisit — replaced by white minimalist in v2 |
| React Three Fiber for 3D | Standard React integration for Three.js | ✓ Good |
| Static blog from .md files | No CMS dependency, version controlled | ✓ Good |
| Sticky bottom chat input | Always accessible, follows user | ⚠️ Revisit — redesigned as centered floating transparent bar in v2 |
| Emotion from LLM response | Backend controls robot behavior, clean separation | ✓ Good |
| Storytelling about section | More engaging than timeline/cards | ✓ Good |
| v2: White minimalist theme | Dennis Snellenberg-inspired, award-level design quality | — Pending |
| v2: GSAP + Lenis | Professional animation system for scroll, transitions, text reveals | — Pending |
| v2: Robot in Section 2 | Hero stays clean with photo + typography, robot gets its own showcase | — Pending |
| v2: Centered floating chat | Minimalist, transparent, always-visible, not corner-anchored | — Pending |
| v2: Intro preloader | "Welcome to party" → "Quasar" → curtain reveal — sets the tone | — Pending |

---
*Last updated: 2026-03-15 after v2.0 milestone start*
