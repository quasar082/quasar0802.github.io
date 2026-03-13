# Requirements: RayQuasar Portfolio

**Defined:** 2026-03-13
**Core Value:** The interactive 3D robot chatbot experience — a cute robot that responds with emotions and animations based on LLM-generated answers — must work flawlessly.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FNDN-01**: Fix missing `"use client"` directives on components using React hooks
- [ ] **FNDN-02**: Fix basePath bug for CV download and asset URLs in production
- [ ] **FNDN-03**: Fix hreflang meta tags that declare routes returning 404
- [ ] **FNDN-04**: Fix LoadingScreen timing and scroll magic numbers in HeroSection
- [ ] **FNDN-05**: Establish lab aesthetic with grid/caro pattern background (dark theme CSS variable system)

### 3D Robot

- [ ] **ROBT-01**: User can see an interactive 3D robot model rendered in the hero section via React Three Fiber
- [ ] **ROBT-02**: Robot displays emotion-based animations (happy, sad, excited, thinking, idle) driven by Zustand state
- [ ] **ROBT-03**: 3D model loads with Suspense fallback and graceful loading indicator
- [ ] **ROBT-04**: Robot is wrapped with `dynamic({ ssr: false })` to prevent static export build crash
- [ ] **ROBT-05**: Robot renders performantly on mobile devices with reduced quality fallback

### Chatbot

- [ ] **CHAT-01**: User can type messages in a sticky bottom input bar that follows scroll
- [ ] **CHAT-02**: Messages are sent to external LLM API endpoint via HTTP POST
- [ ] **CHAT-03**: LLM response includes answer text + emotion field that controls robot animation state
- [ ] **CHAT-04**: Chat displays typing indicator while waiting for API response
- [ ] **CHAT-05**: Chatbot gracefully handles API unavailability with fallback message and default robot emotion
- [ ] **CHAT-06**: Chat history is maintained in session via Zustand store

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

- [ ] **I18N-01**: App routes are restructured to `app/[lang]/` pattern with next-intl
- [ ] **I18N-02**: User can switch between Vietnamese and English via language switcher
- [ ] **I18N-03**: All UI text is externalized to translation files (not hardcoded)
- [ ] **I18N-04**: Language preference is detected and persisted client-side
- [ ] **I18N-05**: Static export generates both `/en/` and `/vi/` route trees via generateStaticParams

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

- [ ] **UX-01**: Consistent dark-only theme across all pages with lab aesthetic grid/caro background
- [ ] **UX-02**: Scroll-triggered animations (fade/slide) on content sections via Framer Motion
- [ ] **UX-03**: Fully responsive layout for mobile, tablet, and desktop
- [ ] **UX-04**: Footer displays social links (email, LinkedIn, GitHub) and copyright
- [ ] **UX-05**: CV download button works correctly with proper basePath

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
| FNDN-01 | — | Pending |
| FNDN-02 | — | Pending |
| FNDN-03 | — | Pending |
| FNDN-04 | — | Pending |
| FNDN-05 | — | Pending |
| ROBT-01 | — | Pending |
| ROBT-02 | — | Pending |
| ROBT-03 | — | Pending |
| ROBT-04 | — | Pending |
| ROBT-05 | — | Pending |
| CHAT-01 | — | Pending |
| CHAT-02 | — | Pending |
| CHAT-03 | — | Pending |
| CHAT-04 | — | Pending |
| CHAT-05 | — | Pending |
| CHAT-06 | — | Pending |
| HERO-01 | — | Pending |
| HERO-02 | — | Pending |
| HERO-03 | — | Pending |
| ABUT-01 | — | Pending |
| ABUT-02 | — | Pending |
| ABUT-03 | — | Pending |
| PROJ-01 | — | Pending |
| PROJ-02 | — | Pending |
| PROJ-03 | — | Pending |
| PROJ-04 | — | Pending |
| BLOG-01 | — | Pending |
| BLOG-02 | — | Pending |
| BLOG-03 | — | Pending |
| BLOG-04 | — | Pending |
| BLOG-05 | — | Pending |
| BLOG-06 | — | Pending |
| BLOG-07 | — | Pending |
| BLOG-08 | — | Pending |
| I18N-01 | — | Pending |
| I18N-02 | — | Pending |
| I18N-03 | — | Pending |
| I18N-04 | — | Pending |
| I18N-05 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |
| SEO-04 | — | Pending |
| SEO-05 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| PERF-03 | — | Pending |
| UX-01 | — | Pending |
| UX-02 | — | Pending |
| UX-03 | — | Pending |
| UX-04 | — | Pending |
| UX-05 | — | Pending |

**Coverage:**
- v1 requirements: 49 total
- Mapped to phases: 0
- Unmapped: 49 ⚠️

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 after initial definition*
