# Requirements: RayQuasar Portfolio

**Defined:** 2026-03-15
**Core Value:** The interactive 3D robot chatbot experience — a cute robot that responds with emotions and animations based on LLM-generated answers — must work flawlessly.

## v2 Requirements

Requirements for v2.0 Complete Redesign milestone. Each maps to roadmap phases.

### Animation System

- [ ] **ANIM-01**: Lenis smooth scroll wraps the entire app with GSAP ScrollTrigger sync
- [ ] **ANIM-02**: GSAP plugin registration module (ScrollTrigger, SplitText, Flip, CustomEase)
- [ ] **ANIM-03**: Scroll-triggered text reveals on section headings (clip-path + translateY)
- [ ] **ANIM-04**: Character stagger animations for hero text and key display elements
- [ ] **ANIM-05**: Page transitions with GSAP exit/enter animations between routes

### Preloader

- [ ] **PRLD-01**: Black overlay covers viewport on initial load with scroll locked
- [ ] **PRLD-02**: "Welcome to party" text fades in letter-by-letter, holds, fades out
- [ ] **PRLD-03**: "Quasar" text fades in larger/bolder, holds, fades out
- [ ] **PRLD-04**: Curtain split-reveal transition exposes hero section beneath
- [ ] **PRLD-05**: Lenis and ScrollTrigger activate only after preloader completes

### Theme

- [ ] **THME-01**: White/warm-white background replaces dark lab aesthetic across all pages
- [ ] **THME-02**: CSS variable system updated for light palette (text, borders, surfaces)
- [ ] **THME-03**: Oversized display typography system with clamp-based fluid sizing
- [ ] **THME-04**: Subtle grain/noise texture overlay on white backgrounds
- [ ] **THME-05**: WCAG AA contrast validated on all light backgrounds

### Hero

- [ ] **HERO-01**: Full-viewport (100dvh) hero section with centered placeholder photo
- [ ] **HERO-02**: Oversized marquee name scrolling horizontally in continuous loop
- [ ] **HERO-03**: "AI Engineer" role text and tagline prominently displayed
- [ ] **HERO-04**: Marquee speed reacts to user scroll velocity via Lenis
- [ ] **HERO-05**: Minimal redesigned navigation (logo left, nav links right, white theme)

### Robot

- [ ] **ROBT-06**: 3D robot relocated from hero to dedicated Section 2
- [ ] **ROBT-07**: Scroll-triggered entrance animation when Section 2 enters viewport
- [ ] **ROBT-08**: Section 2 has CTA text encouraging robot interaction

### Chat

- [ ] **CHAT-07**: Always-visible slim transparent floating bar, centered at viewport bottom
- [ ] **CHAT-08**: Glassmorphism styling (backdrop-blur, semi-transparent white)
- [ ] **CHAT-09**: Chat messages appear above bar in transparent panel on send
- [ ] **CHAT-10**: Full-width on mobile, ~500px centered on desktop

### Content

- [ ] **CONT-01**: About section in storytelling format with scroll-triggered reveals
- [ ] **CONT-02**: About content covers AI expertise (NLP, LLM, multi-agent, RAG)
- [ ] **CONT-03**: Projects section with minimalist card grid, data-driven
- [ ] **CONT-04**: Project detail pages with case study, screenshots, links
- [ ] **CONT-05**: Blog listing page with post cards (title, date, tags, excerpt)
- [ ] **CONT-06**: Blog post page with rendered MDX, syntax highlighting, TOC
- [ ] **CONT-07**: Blog tag filtering and client-side search
- [ ] **CONT-08**: Blog series support for multi-part articles
- [ ] **CONT-09**: Footer with large CTA typography and social links

### Micro-interactions

- [ ] **MICR-01**: Magnetic hover effects on buttons and nav links
- [ ] **MICR-02**: Custom cursor dot that follows mouse movement
- [ ] **MICR-03**: Hover underline slide animations on text links
- [ ] **MICR-04**: Section numbering ("01", "02") in monospace
- [ ] **MICR-05**: Animated section dividers (SVG lines or shapes on scroll)

### SEO & Performance

- [ ] **PERF-04**: Every page has proper meta tags, OG tags, and canonical URLs
- [ ] **PERF-05**: JSON-LD structured data (Person + Article schemas)
- [ ] **PERF-06**: Sitemap includes all pages and blog posts
- [ ] **PERF-07**: 3D model lazy-loads with code splitting, page usable under 3s without 3D
- [ ] **PERF-08**: Images optimized (WebP/AVIF or next/image)

## v1 Requirements (Validated)

Shipped in v1.0 milestone. Confirmed valuable.

### Foundation

- ✓ **FNDN-03**: Fix hreflang meta tags — v1.0 Phase 2
- ✓ **FNDN-05**: Lab aesthetic with grid/caro pattern background — v1.0 Phase 2 (replaced by THME-01 in v2)

### 3D Robot

- ✓ **ROBT-01**: Interactive 3D robot model via React Three Fiber — v1.0 Phase 3
- ✓ **ROBT-02**: Emotion-based animations (happy, sad, excited, thinking, idle) — v1.0 Phase 3
- ✓ **ROBT-03**: Suspense fallback and loading indicator — v1.0 Phase 3
- ✓ **ROBT-04**: dynamic({ ssr: false }) for static export build — v1.0 Phase 3
- ✓ **ROBT-05**: Performant on mobile with reduced quality fallback — v1.0 Phase 3

### Chatbot

- ✓ **CHAT-01**: Sticky bottom input bar — v1.0 Phase 4
- ✓ **CHAT-02**: Messages sent to LLM API via HTTP POST — v1.0 Phase 4
- ✓ **CHAT-03**: LLM response includes answer + emotion — v1.0 Phase 4
- ✓ **CHAT-04**: Typing indicator during API response — v1.0 Phase 4
- ✓ **CHAT-05**: Graceful API unavailability handling — v1.0 Phase 4
- ✓ **CHAT-06**: Session chat history via Zustand — v1.0 Phase 4

### Internationalization

- ✓ **I18N-01**: app/[lang]/ routing with next-intl — v1.0 Phase 2
- ✓ **I18N-02**: Language switcher (Vietnamese/English) — v1.0 Phase 2
- ✓ **I18N-03**: All UI text externalized to translation files — v1.0 Phase 2
- ✓ **I18N-04**: Language preference detected and persisted — v1.0 Phase 2
- ✓ **I18N-05**: Static export generates /en/ and /vi/ route trees — v1.0 Phase 2

### Visual & UX

- ✓ **UX-01**: Consistent dark theme with lab aesthetic — v1.0 Phase 2 (replaced by THME-01 in v2)

## Future Requirements

Deferred beyond v2.0.

### Blog Enhancements

- **BLOG-V2-01**: RSS feed for blog posts
- **BLOG-V2-02**: Reading time estimation per post
- **BLOG-V2-03**: Related posts suggestions

### Analytics & Monitoring

- **ANLX-01**: Privacy-respecting analytics (Plausible or similar)
- **ANLX-02**: Performance monitoring dashboard

### Community

- **CMTY-01**: Blog comments via GitHub Discussions integration
- **CMTY-02**: Share buttons per blog post

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Dark theme / theme toggle | White minimalist is the v2 brand identity |
| Contact form | Links sufficient; no backend email service needed |
| Real-time WebSocket chat | HTTP request/response sufficient for chatbot |
| CMS / admin panel | .md files in repo, developer-managed |
| User authentication | Public portfolio, no gated content |
| Video hero background | Static photo; robot provides the motion |
| Parallax hero | Dated pattern, competes with marquee typography |
| Three.js background effects | Competes with robot for GPU/visual attention |
| Scroll-hijacking/snap | Hostile UX; Lenis provides smooth scroll without hijacking |
| Infinite scroll for blog | Under 20 posts; pagination unnecessary |
| Custom scrollbar | Lenis handles feel; native scrollbar auto-hides on macOS |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ANIM-01 | Phase 11 | Pending |
| ANIM-02 | Phase 11 | Pending |
| ANIM-03 | Phase 16 | Pending |
| ANIM-04 | Phase 16 | Pending |
| ANIM-05 | Phase 17 | Pending |
| PRLD-01 | Phase 13 | Pending |
| PRLD-02 | Phase 13 | Pending |
| PRLD-03 | Phase 13 | Pending |
| PRLD-04 | Phase 13 | Pending |
| PRLD-05 | Phase 13 | Pending |
| THME-01 | Phase 12 | Pending |
| THME-02 | Phase 12 | Pending |
| THME-03 | Phase 12 | Pending |
| THME-04 | Phase 12 | Pending |
| THME-05 | Phase 12 | Pending |
| HERO-01 | Phase 14 | Pending |
| HERO-02 | Phase 14 | Pending |
| HERO-03 | Phase 14 | Pending |
| HERO-04 | Phase 14 | Pending |
| HERO-05 | Phase 14 | Pending |
| ROBT-06 | Phase 15 | Pending |
| ROBT-07 | Phase 15 | Pending |
| ROBT-08 | Phase 15 | Pending |
| CHAT-07 | Phase 15 | Pending |
| CHAT-08 | Phase 15 | Pending |
| CHAT-09 | Phase 15 | Pending |
| CHAT-10 | Phase 15 | Pending |
| CONT-01 | Phase 16 | Pending |
| CONT-02 | Phase 16 | Pending |
| CONT-03 | Phase 16 | Pending |
| CONT-04 | Phase 16 | Pending |
| CONT-05 | Phase 16 | Pending |
| CONT-06 | Phase 16 | Pending |
| CONT-07 | Phase 16 | Pending |
| CONT-08 | Phase 16 | Pending |
| CONT-09 | Phase 16 | Pending |
| MICR-01 | Phase 17 | Pending |
| MICR-02 | Phase 17 | Pending |
| MICR-03 | Phase 17 | Pending |
| MICR-04 | Phase 17 | Pending |
| MICR-05 | Phase 17 | Pending |
| PERF-04 | Phase 18 | Pending |
| PERF-05 | Phase 18 | Pending |
| PERF-06 | Phase 18 | Pending |
| PERF-07 | Phase 18 | Pending |
| PERF-08 | Phase 18 | Pending |

**Coverage:**
- v2 requirements: 46 total (corrected from initial count of 42)
- Mapped to phases: 46
- Unmapped: 0

---
*Requirements defined: 2026-03-15*
*Last updated: 2026-03-15 after v2.0 roadmap creation*
