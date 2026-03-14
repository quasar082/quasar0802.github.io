# Requirements: RayQuasar Portfolio

**Defined:** 2026-03-13
**Core Value:** The interactive 3D robot chatbot experience — a cute robot that responds with emotions and animations based on LLM-generated answers — must work flawlessly.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- ~~**FNDN-01**: Fix missing `"use client"` directives on components using React hooks~~ — N/A (old code removed)
- ~~**FNDN-02**: Fix basePath bug for CV download and asset URLs in production~~ — N/A (old code removed)
- [x] **FNDN-03**: Fix hreflang meta tags that declare routes returning 404
- ~~**FNDN-04**: Fix LoadingScreen timing and scroll magic numbers in HeroSection~~ — N/A (old code removed)
- [x] **FNDN-05**: Establish lab aesthetic with grid/caro pattern background (dark theme CSS variable system)

### 3D Robot

- [x] **ROBT-01**: User can see an interactive 3D robot model rendered in the hero section via React Three Fiber
- [x] **ROBT-02**: Robot displays emotion-based animations (happy, sad, excited, thinking, idle) driven by Zustand state
- [x] **ROBT-03**: 3D model loads with Suspense fallback and graceful loading indicator
- [x] **ROBT-04**: Robot is wrapped with `dynamic({ ssr: false })` to prevent static export build crash
- [x] **ROBT-05**: Robot renders performantly on mobile devices with reduced quality fallback

### Chatbot

- [x] **CHAT-01**: User can type messages in a sticky bottom input bar that follows scroll
- [x] **CHAT-02**: Messages are sent to external LLM API endpoint via HTTP POST
- [x] **CHAT-03**: LLM response includes answer text + emotion field that controls robot animation state
- [x] **CHAT-04**: Chat displays typing indicator while waiting for API response
- [x] **CHAT-05**: Chatbot gracefully handles API unavailability with fallback message and default robot emotion
- [x] **CHAT-06**: Chat history is maintained in session via Zustand store

### Hero Section

- [ ] **HERO-01**: Hero section displays static black hole background image with 3D robot in foreground
- [ ] **HERO-02**: User's name, role (AI Engineer), and tagline ("Make Wall-E can love again") are prominently displayed
- [ ] **HERO-03**: Loading screen extends to handle 3D model loading before revealing hero

### Content - About

- [ ] **ABUT-01**: About section tells the owner's story in storytelling format with text and images
- [ ] **ABUT-02**: Content covers AI engineering expertise: NLP, LLM, multi-agent, RAG architecture
- [ ] **ABUT-03**: Section uses scroll-triggered fade/slide animations

### Content - Projects

- [ ] **PROJ-01**: Projects section displays data-driven card grid (not hardcoded)
- [ ] **PROJ-02**: Each project card shows title, description, tech stack, and thumbnail
- [ ] **PROJ-03**: User can click a project card to view a detail page with full case study
- [ ] **PROJ-04**: Project detail pages include screenshots, demo links, and GitHub links where applicable

### Blog

- [ ] **BLOG-01**: User can browse a list of blog posts rendered from .md/.mdx files in the repository
- [ ] **BLOG-02**: User can read a blog post with properly rendered MDX content
- [ ] **BLOG-03**: Blog posts have syntax-highlighted code blocks via rehype-pretty-code
- [ ] **BLOG-04**: Each blog post page displays an auto-generated table of contents from headings
- [ ] **BLOG-05**: User can filter blog posts by tags
- [ ] **BLOG-06**: User can search blog posts via client-side fuzzy search (Fuse.js)
- [ ] **BLOG-07**: Blog posts support series grouping for multi-part articles
- [ ] **BLOG-08**: Blog is compatible with static export via generateStaticParams

### Internationalization

- [x] **I18N-01**: App routes are restructured to `app/[lang]/` pattern with next-intl
- [x] **I18N-02**: User can switch between Vietnamese and English via language switcher
- [x] **I18N-03**: All UI text is externalized to translation files (not hardcoded)
- [x] **I18N-04**: Language preference is detected and persisted client-side
- [x] **I18N-05**: Static export generates both `/en/` and `/vi/` route trees via generateStaticParams

### SEO & Performance

- [ ] **SEO-01**: Every page has proper meta tags, Open Graph tags, and canonical URLs
- [ ] **SEO-02**: JSON-LD structured data for Person schema on main pages
- [ ] **SEO-03**: JSON-LD Article schema on each blog post page
- [ ] **SEO-04**: Sitemap includes all pages and blog post URLs
- [ ] **SEO-05**: hreflang tags correctly point to existing `/en/` and `/vi/` routes
- [ ] **PERF-01**: 3D model lazy-loads with code splitting; page loads under 3 seconds without 3D
- [ ] **PERF-02**: Three.js bundle is code-split into separate chunk
- [ ] **PERF-03**: Images are optimized (next/image or manual optimization for static export)

### Visual & UX

- [x] **UX-01**: Consistent dark-only theme across all pages with lab aesthetic grid/caro background
- [ ] **UX-02**: Scroll-triggered animations (fade/slide) on content sections via Framer Motion
- [ ] **UX-03**: Fully responsive layout for mobile, tablet, and desktop
- [ ] **UX-04**: Footer displays social links (email, LinkedIn, GitHub) and copyright
- ~~**UX-05**: CV download button works correctly with proper basePath~~ — N/A (old code removed)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

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
| Light mode / theme toggle | Dark-only lab aesthetic is the brand identity |
| Contact form | Links sufficient; no backend email service needed |
| Real-time WebSocket chat | HTTP request/response is imperceptible for chatbot use case |
| CMS / admin panel | .md files in repo, developer-managed |
| User authentication | Public portfolio, no gated content |
| Animated/video hero background | Static image; robot provides the motion |
| Comment system on blog | Requires moderation; defer to v2 GitHub Discussions |
| Mobile app / PWA | Web-only focus |
| Multi-author blog | Personal portfolio, single author |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDN-01 | Phase 1 | N/A (old code removed) |
| FNDN-02 | Phase 1 | N/A (old code removed) |
| FNDN-04 | Phase 1 | N/A (old code removed) |
| UX-05 | Phase 1 | N/A (old code removed) |
| FNDN-03 | Phase 2 | Complete |
| FNDN-05 | Phase 2 | Complete |
| I18N-01 | Phase 2 | Complete |
| I18N-02 | Phase 2 | Complete |
| I18N-03 | Phase 2 | Complete |
| I18N-04 | Phase 2 | Complete |
| I18N-05 | Phase 2 | Complete |
| UX-01 | Phase 2 | Complete |
| ROBT-01 | Phase 3 | Complete |
| ROBT-02 | Phase 3 | Complete |
| ROBT-03 | Phase 3 | Complete |
| ROBT-04 | Phase 3 | Complete |
| ROBT-05 | Phase 3 | Complete |
| CHAT-01 | Phase 4 | Complete |
| CHAT-02 | Phase 4 | Complete |
| CHAT-03 | Phase 4 | Complete |
| CHAT-04 | Phase 4 | Complete |
| CHAT-05 | Phase 4 | Complete |
| CHAT-06 | Phase 4 | Complete |
| HERO-01 | Phase 5 | Pending |
| HERO-02 | Phase 5 | Pending |
| HERO-03 | Phase 5 | Pending |
| ABUT-01 | Phase 6 | Pending |
| ABUT-02 | Phase 6 | Pending |
| ABUT-03 | Phase 6 | Pending |
| UX-02 | Phase 6 | Pending |
| PROJ-01 | Phase 7 | Pending |
| PROJ-02 | Phase 7 | Pending |
| PROJ-03 | Phase 7 | Pending |
| PROJ-04 | Phase 7 | Pending |
| UX-03 | Phase 7 | Pending |
| UX-04 | Phase 7 | Pending |
| BLOG-01 | Phase 8 | Pending |
| BLOG-02 | Phase 8 | Pending |
| BLOG-03 | Phase 8 | Pending |
| BLOG-04 | Phase 8 | Pending |
| BLOG-05 | Phase 8 | Pending |
| BLOG-06 | Phase 8 | Pending |
| BLOG-07 | Phase 8 | Pending |
| BLOG-08 | Phase 8 | Pending |
| SEO-01 | Phase 9 | Pending |
| SEO-02 | Phase 9 | Pending |
| SEO-03 | Phase 9 | Pending |
| SEO-04 | Phase 9 | Pending |
| SEO-05 | Phase 9 | Pending |
| PERF-01 | Phase 10 | Pending |
| PERF-02 | Phase 10 | Pending |
| PERF-03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 49 total
- Mapped to phases: 49
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 — traceability populated after roadmap creation*
