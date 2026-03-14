# Roadmap: RayQuasar Portfolio

## Overview

Starting from a fresh Next.js 16 app (TypeScript, Tailwind CSS v4, App Router), this roadmap builds the full AI engineer portfolio in ten focused phases. Phase 1 sets up the project foundation with the core tooling. Phase 2 establishes bilingual routing and the lab aesthetic. Phases 3-4 build the centerpiece 3D robot and chatbot. Phase 5 integrates the hero section. Phases 6-7 build content sections. Phase 8 adds the blog system. Phases 9-10 polish SEO and performance. The result is a bilingual, interactive portfolio distinguished by a live LLM-driven 3D robot chatbot.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Project Setup** - Fresh Next.js 16 app with TypeScript, Tailwind CSS v4, and core dependencies
- [ ] **Phase 2: i18n Foundation + Lab Aesthetic** - Restructure to `app/[lang]/` routing, install next-intl, establish dark theme CSS system
- [x] **Phase 3: 3D Robot Subsystem** - Interactive robot rendered in browser via React Three Fiber with emotion-based animations (completed 2026-03-13)
- [x] **Phase 4: Chatbot Integration** - Sticky LLM-connected chatbot that drives robot emotions via Zustand
- [ ] **Phase 5: Hero Section** - Redesigned hero with static black hole background and 3D robot foreground
- [ ] **Phase 6: About + Introduce Sections** - Storytelling-format sections with scroll animations
- [ ] **Phase 7: Projects Section + Detail Pages** - Data-driven project cards with full case study pages
- [ ] **Phase 8: Blog System** - Full MDX blog with tags, TOC, syntax highlighting, search, and series
- [ ] **Phase 9: SEO** - Complete meta tags, structured data, sitemap, and correct hreflang for all pages
- [ ] **Phase 10: Performance Polish** - Bundle splitting, lazy loading audit, and Lighthouse optimization

## Phase Details

### Phase 1: Project Setup
**Goal**: A clean Next.js 16 project is scaffolded with the core tooling (TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Lucide React) and all old code is removed
**Depends on**: Nothing (first phase)
**Requirements**: N/A (old FNDN-01, FNDN-02, FNDN-04, UX-05 are obsolete — old code deleted)
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts the Next.js dev server without errors
  2. `npm run build` completes successfully
  3. `public/HaMinhQuan_CV.pdf` is preserved and accessible
  4. `model-3d/` directory with .glb files is intact
  5. `framer-motion`, `zustand`, and `lucide-react` are installed in package.json
**Plans:** N/A (single setup commit)

### Phase 2: i18n Foundation + Lab Aesthetic
**Goal**: The app is restructured to bilingual routing and has the visual identity system that all future sections inherit
**Depends on**: Phase 1
**Requirements**: FNDN-03, FNDN-05, I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, UX-01
**Success Criteria** (what must be TRUE):
  1. Visiting `/en/` and `/vi/` both serve the portfolio — no 404s
  2. The language switcher in the header toggles between English and Vietnamese and the UI text updates
  3. Language preference is detected from browser settings on first visit and remembered on return
  4. The static export build generates `/en/` and `/vi/` route trees — both work after `gh-pages` deploy
  5. All pages display the dark grid/caro lab aesthetic background with the CSS variable token system
**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — i18n routing infrastructure + design tokens + fonts + route structure
- [ ] 02-02-PLAN.md — Header + language switcher + mobile menu + translations + visual verification

### Phase 3: 3D Robot Subsystem
**Goal**: A 3D robot character is rendered in the browser, displays emotion-based animations, and is safe to include in a static export build
**Depends on**: Phase 2
**Requirements**: ROBT-01, ROBT-02, ROBT-03, ROBT-04, ROBT-05
**Success Criteria** (what must be TRUE):
  1. A 3D robot model is visible and interactive in the browser (rotates/reacts) — no blank canvas
  2. The robot plays distinct animations for at least 5 emotions: happy, sad, excited, thinking, idle
  3. The build (`npm run build`) completes without `window is not defined` errors — SSR crash is prevented
  4. A loading indicator is shown while the 3D model is downloading — the page does not appear broken mid-load
  5. On a mobile device, the robot renders at reduced quality (lower polygon or texture) without crashing or excessive frame drops
**Plans:** 2/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Install R3F dependencies, place model, create robot types and Zustand store
- [x] 03-02-PLAN.md — Build 3D robot components (model, scene, dynamic wrapper, loading), integrate into page, visual verification

### Phase 4: Chatbot Integration
**Goal**: Visitors can chat with the robot — messages reach the LLM backend via streaming, responses control robot animations via Zustand, and unavailability is handled gracefully with a demo fallback mode
**Depends on**: Phase 3
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06
**Success Criteria** (what must be TRUE):
  1. The chat input bar is visible at the bottom of the screen and stays there while scrolling through the full page
  2. Typing a message and submitting it sends an HTTP POST to the LLM endpoint and a reply appears in the chat
  3. After receiving a reply, the robot's animation changes to match the emotion field in the LLM response
  4. A typing indicator (dots or spinner) is shown while waiting for the API response
  5. When the LLM API is unreachable, the chat shows a friendly fallback message and the robot plays its idle animation
  6. Scrolling away and back preserves the full conversation history in the current browser session
**Plans:** 2/2 plans complete

Plans:
- [x] 04-01-PLAN.md — Chat types, Zustand store with localStorage persistence, SSE streaming service, mock/demo mode, i18n strings
- [x] 04-02-PLAN.md — Chat UI components (ChatBar, ChatPanel, ChatBubble, ChatInput, TypingIndicator, PromptChips), layout integration, visual verification

### Phase 5: Hero Section
**Goal**: The hero section presents the portfolio owner's identity and the 3D robot as the visual centerpiece on a dark space background
**Depends on**: Phase 4
**Requirements**: HERO-01, HERO-02, HERO-03
**Success Criteria** (what must be TRUE):
  1. The hero section displays a static black hole background image with the 3D robot rendered in front of it — no plain black background
  2. The owner's name, "AI Engineer" role, and "Make Wall-E can love again" tagline are clearly legible in the hero
  3. The loading screen persists until the 3D model is ready, then transitions into the hero — visitors never see a partially loaded hero
**Plans**: TBD

### Phase 6: About + Introduce Sections
**Goal**: Visitors can read the owner's story and AI engineering background in a narrative format with scroll-triggered animations
**Depends on**: Phase 2
**Requirements**: ABUT-01, ABUT-02, ABUT-03, UX-02
**Success Criteria** (what must be TRUE):
  1. The About section tells a continuous story — not a list of bullet points or a timeline widget
  2. The section explicitly mentions the owner's expertise areas: NLP, LLM, multi-agent systems, RAG architecture
  3. Scrolling into the About and Introduce sections triggers fade or slide animations on content blocks — not a static page dump
**Plans**: TBD

### Phase 7: Projects Section + Detail Pages
**Goal**: Visitors can browse the portfolio owner's projects as a card grid and open any project to read a full case study
**Depends on**: Phase 2
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, UX-03, UX-04
**Success Criteria** (what must be TRUE):
  1. The projects section renders cards from a data source (array or files) — adding a new project requires no JSX change
  2. Each project card shows a title, brief description, tech stack tags, and a thumbnail image
  3. Clicking a project card navigates to a detail page at `/en/projects/[slug]` or `/vi/projects/[slug]`
  4. The project detail page shows screenshots, a written case study, and links to demo/GitHub where applicable
  5. The site layout is usable on mobile (375px), tablet (768px), and desktop (1280px+) — no horizontal overflow
  6. The footer is present on all pages with email, LinkedIn, and GitHub links
**Plans**: TBD

### Phase 8: Blog System
**Goal**: Visitors can browse, filter, search, and read technical blog posts rendered from markdown files in the repository
**Depends on**: Phase 2
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, BLOG-08
**Success Criteria** (what must be TRUE):
  1. Visiting `/en/blog` or `/vi/blog` shows a list of post cards with title, date, tags, and excerpt
  2. Clicking a post navigates to a full post page with properly rendered MDX — headings, images, and lists all render correctly
  3. Code blocks in posts display with syntax highlighting — language tokens are color-coded
  4. A table of contents sidebar or section lists the headings of the current post — clicking a heading jumps to it
  5. Clicking a tag on any post or the blog index filters the list to only posts with that tag
  6. Typing in the search box filters the post list in real time (client-side, no server request)
  7. Posts marked as part of a series display navigation links to the other parts of the series
  8. `npm run build` generates static HTML for all blog posts — no server-rendering error for any post page
**Plans**: TBD

### Phase 9: SEO
**Goal**: Every page on the site is fully indexed-ready with correct meta tags, structured data, sitemap coverage, and working hreflang alternates
**Depends on**: Phase 8
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05
**Success Criteria** (what must be TRUE):
  1. Opening DevTools on any page shows a populated `<title>`, `<meta name="description">`, and `og:image` tag with correct absolute URLs
  2. Pasting the homepage URL into a JSON-LD validator returns a valid Person schema with the owner's name and role
  3. Pasting any blog post URL into a JSON-LD validator returns a valid Article schema with title, date, and author
  4. The sitemap at `/sitemap.xml` includes URLs for all pages, projects, and blog posts — including `/en/` and `/vi/` variants
  5. All hreflang `<link rel="alternate">` tags point to existing, non-404 routes — no stale alternates from the previous single-locale structure
**Plans**: TBD

### Phase 10: Performance Polish
**Goal**: The site loads fast on real devices and the Three.js bundle does not block the initial page render
**Depends on**: Phase 9
**Requirements**: PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. The page is usable (text + nav visible, no layout shift) in under 3 seconds on a simulated 4G connection without the 3D model having loaded yet
  2. The Three.js code is in a separate JavaScript chunk from the main application bundle — visible in the build output
  3. All images on the site are served in a modern format (WebP or AVIF) or are next/image-optimized — no uncompressed JPEGs or PNGs over 200KB
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10

Note: Phase 6 depends on Phase 2 (not Phase 5), so it can run in parallel with Phases 3-5 if desired. Phase 7 similarly depends on Phase 2 only.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup | N/A | Complete | 2026-03-13 |
| 2. i18n Foundation + Lab Aesthetic | 0/2 | Planning complete | - |
| 3. 3D Robot Subsystem | 2/2 | Complete   | 2026-03-14 |
| 4. Chatbot Integration | 2/2 | Complete | 2026-03-14 |
| 5. Hero Section | 0/? | Not started | - |
| 6. About + Introduce Sections | 0/? | Not started | - |
| 7. Projects Section + Detail Pages | 0/? | Not started | - |
| 8. Blog System | 0/? | Not started | - |
| 9. SEO | 0/? | Not started | - |
| 10. Performance Polish | 0/? | Not started | - |
