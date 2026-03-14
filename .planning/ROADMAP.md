# Roadmap: RayQuasar Portfolio

## Milestones

- ~~**v1.0 Foundation**~~ - Phases 1-4 (shipped 2026-03-14, Phases 5-10 superseded by v2.0)
- **v2.0 Complete Redesign** - Phases 11-18 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 Foundation (Phases 1-4) - SHIPPED 2026-03-14</summary>

- [x] **Phase 1: Project Setup** - Fresh Next.js 16 app with TypeScript, Tailwind CSS v4, and core dependencies
- [x] **Phase 2: i18n Foundation + Lab Aesthetic** - Restructure to `app/[lang]/` routing, install next-intl, establish dark theme CSS system
- [x] **Phase 3: 3D Robot Subsystem** - Interactive robot rendered in browser via React Three Fiber with emotion-based animations
- [x] **Phase 4: Chatbot Integration** - Sticky LLM-connected chatbot that drives robot emotions via Zustand

Phases 5-10 (Hero, About, Projects, Blog, SEO, Performance) superseded by v2.0 Complete Redesign.

</details>

### v2.0 Complete Redesign

- [ ] **Phase 11: Animation Infrastructure** - Install GSAP + Lenis, wire SmoothScrollProvider and plugin registry
- [ ] **Phase 12: White Theme Overhaul** - Replace dark lab aesthetic with white minimalist CSS system and fluid typography
- [ ] **Phase 13: Preloader Sequence** - Black overlay with text sequence and curtain reveal gating the full experience
- [ ] **Phase 14: Hero Section** - Full-viewport hero with centered photo, oversized marquee name, and minimal nav
- [ ] **Phase 15: Robot Relocation + Chat Redesign** - Move 3D robot to Section 2 and redesign chat bar as centered floating glass bar
- [ ] **Phase 16: Content Sections** - About, Projects, Blog, Footer with scroll-triggered text reveals and animations
- [ ] **Phase 17: Micro-interactions + Page Transitions** - Magnetic hover, custom cursor, section dividers, and GSAP page transitions
- [ ] **Phase 18: SEO + Performance** - Meta tags, structured data, sitemap, image optimization, and lazy loading audit

## Phase Details

### Phase 11: Animation Infrastructure
**Goal**: The GSAP + Lenis animation system is installed, synchronized, and available for every downstream component to use immediately
**Depends on**: Phase 4 (v1.0 codebase)
**Requirements**: ANIM-01, ANIM-02
**Success Criteria** (what must be TRUE):
  1. Scrolling any page feels smooth and continuous (Lenis active) with no native scroll jank
  2. A simple ScrollTrigger animation (e.g., fade-in on scroll) fires correctly in sync with Lenis scroll position
  3. Navigating between routes and back does not leave zombie ScrollTrigger instances (no console warnings, no stale pinned elements)
  4. The static export build (`npm run build`) completes without GSAP/Lenis SSR errors
**Plans**: TBD

### Phase 12: White Theme Overhaul
**Goal**: Every existing page and component renders against a white minimalist visual system with fluid oversized typography
**Depends on**: Phase 11
**Requirements**: THME-01, THME-02, THME-03, THME-04, THME-05
**Success Criteria** (what must be TRUE):
  1. All pages display a white/warm-white background with no remnants of the dark lab aesthetic
  2. CSS variables for text, borders, and surfaces follow a light palette and are used consistently across all components
  3. Heading text scales fluidly from mobile to desktop using clamp-based sizing (no fixed pixel breakpoints)
  4. A subtle grain/noise texture overlay is visible on white backgrounds, adding warmth
  5. All text on light backgrounds passes WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text)
**Plans**: TBD

### Phase 13: Preloader Sequence
**Goal**: First-time visitors experience a cinematic intro sequence that sets the tone before revealing the site
**Depends on**: Phase 12
**Requirements**: PRLD-01, PRLD-02, PRLD-03, PRLD-04, PRLD-05
**Success Criteria** (what must be TRUE):
  1. On initial page load, a black overlay covers the entire viewport and the page cannot be scrolled
  2. The text "Welcome to party" fades in letter-by-letter, holds briefly, then fades out
  3. The text "Quasar" fades in at a larger/bolder size, holds, then fades out
  4. A curtain split-reveal transition exposes the hero section beneath
  5. Smooth scroll and all scroll-triggered animations activate only after the preloader sequence completes (not during)
**Plans**: TBD

### Phase 14: Hero Section
**Goal**: The first screen after the preloader establishes the portfolio owner's identity with a striking full-viewport layout
**Depends on**: Phase 13
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05
**Success Criteria** (what must be TRUE):
  1. The hero section fills the full viewport (100dvh) with a centered placeholder photo
  2. An oversized marquee with the owner's name scrolls horizontally in a continuous loop
  3. "AI Engineer" role text and a tagline are prominently displayed and legible
  4. Scrolling faster makes the marquee speed up; stopping scroll lets it settle back to base speed
  5. A minimal navigation bar (logo left, nav links right) is visible in the white theme style
**Plans**: TBD

### Phase 15: Robot Relocation + Chat Redesign
**Goal**: The 3D robot has its own dedicated showcase section and the chat bar is redesigned as a sleek centered floating bar
**Depends on**: Phase 14
**Requirements**: ROBT-06, ROBT-07, ROBT-08, CHAT-07, CHAT-08, CHAT-09, CHAT-10
**Success Criteria** (what must be TRUE):
  1. The 3D robot is no longer in the hero section; it appears in a dedicated Section 2 below the hero
  2. Scrolling into Section 2 triggers an entrance animation on the robot area
  3. Section 2 displays a CTA text encouraging the visitor to interact with the robot
  4. A slim transparent chat bar is always visible at the bottom center of the viewport on every page
  5. The chat bar has glassmorphism styling (backdrop-blur, semi-transparent white background)
  6. Sending a message causes a transparent chat panel to appear above the bar with the conversation
  7. The chat bar is full-width on mobile and approximately 500px centered on desktop
**Plans**: TBD

### Phase 16: Content Sections
**Goal**: All content sections (About, Projects, Blog, Footer) are built with the white minimalist aesthetic and scroll-triggered animations
**Depends on**: Phase 15
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09, ANIM-03, ANIM-04
**Success Criteria** (what must be TRUE):
  1. The About section tells the owner's story in a narrative format (not bullet points) with AI expertise areas mentioned
  2. Scrolling into any section heading triggers a text reveal animation (clip-path + translateY)
  3. Key display elements (hero text, section titles) animate with character-by-character stagger
  4. The Projects section shows a minimalist card grid driven by data (adding a project requires no JSX changes)
  5. Clicking a project card opens a detail page with case study content, screenshots, and links
  6. The blog listing at `/en/blog` shows post cards with title, date, tags, and excerpt
  7. A blog post page renders MDX with syntax-highlighted code blocks and a clickable table of contents
  8. Blog posts can be filtered by tag and searched by keyword in real time
  9. Posts in a series display navigation links to other parts
  10. A footer with large CTA typography and social links appears at the bottom of every page
**Plans**: TBD

### Phase 17: Micro-interactions + Page Transitions
**Goal**: The site is elevated to award-level polish with micro-interactions and smooth route transitions
**Depends on**: Phase 16
**Requirements**: MICR-01, MICR-02, MICR-03, MICR-04, MICR-05, ANIM-05
**Success Criteria** (what must be TRUE):
  1. Hovering over navigation links and CTA buttons produces a magnetic pull effect toward the cursor
  2. A custom cursor dot follows mouse movement across the site (desktop only)
  3. Text links display a sliding underline animation on hover
  4. Section numbers ("01", "02", etc.) appear in monospace font alongside section headings
  5. Animated SVG dividers or shapes appear between sections on scroll
  6. Navigating between routes plays a GSAP exit animation on the current page and an enter animation on the new page
**Plans**: TBD

### Phase 18: SEO + Performance
**Goal**: Every page is fully indexed-ready, images are optimized, and the 3D model does not block page usability
**Depends on**: Phase 17
**Requirements**: PERF-04, PERF-05, PERF-06, PERF-07, PERF-08
**Success Criteria** (what must be TRUE):
  1. Every page has a populated `<title>`, `<meta name="description">`, `og:image`, and canonical URL
  2. JSON-LD structured data (Person schema on homepage, Article schema on blog posts) validates correctly
  3. The sitemap at `/sitemap.xml` includes all pages, projects, and blog posts in both `/en/` and `/vi/` variants
  4. The 3D model lazy-loads via code splitting; the page is usable (text + nav visible) under 3 seconds without 3D
  5. All images are served in WebP/AVIF format or optimized via next/image (no uncompressed assets over 200KB)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Setup | v1.0 | N/A | Complete | 2026-03-13 |
| 2. i18n + Lab Aesthetic | v1.0 | 0/2 | Planning complete | - |
| 3. 3D Robot Subsystem | v1.0 | 2/2 | Complete | 2026-03-14 |
| 4. Chatbot Integration | v1.0 | 2/2 | Complete | 2026-03-14 |
| 11. Animation Infrastructure | v2.0 | 0/? | Not started | - |
| 12. White Theme Overhaul | v2.0 | 0/? | Not started | - |
| 13. Preloader Sequence | v2.0 | 0/? | Not started | - |
| 14. Hero Section | v2.0 | 0/? | Not started | - |
| 15. Robot + Chat Redesign | v2.0 | 0/? | Not started | - |
| 16. Content Sections | v2.0 | 0/? | Not started | - |
| 17. Micro-interactions | v2.0 | 0/? | Not started | - |
| 18. SEO + Performance | v2.0 | 0/? | Not started | - |
