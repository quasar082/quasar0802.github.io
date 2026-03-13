# Feature Landscape

**Domain:** AI Engineer personal portfolio — interactive, bilingual, with 3D chatbot centerpiece
**Researched:** 2026-03-13
**Project:** RayQuasar / QuanMofii Portfolio

---

## Table Stakes

Features that recruiters and hiring managers expect. Missing one makes the portfolio feel unfinished or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with name + role | First impression, immediate identity signal | Low | Already partially exists; needs robot replacement |
| About / story section | Recruiters need to understand the person, not just the resume | Low | Stub exists; needs real content |
| Projects showcase with screenshots | Primary credibility signal — "show don't tell" | Low-Med | 4 projects hardcoded; needs data-driven expansion |
| CV / resume download | Immediate action path for recruiters | Low | Exists but basePath bug must be fixed |
| Contact / social links | How to reach the person | Low | Footer has them; needs cleanup |
| Responsive design (mobile + desktop) | >60% of portfolio viewers are on mobile | Med | Must be validated for new sections |
| Fast initial load (sub 3s) | Slow portfolios get abandoned; signals poor engineering | Med | Static export helps; 3D must lazy-load |
| SEO fundamentals (title, meta, OG, sitemap) | Recruiters share links, Google indexes the page | Low | Already implemented; maintain across new routes |
| Readable typography at all sizes | Dense or illegible text signals poor UI craft | Low | Tailwind + custom fonts in place |
| Working links (no 404s) | Broken links destroy credibility immediately | Low | hreflang declares `/vi` and `/en` but routes don't exist — critical fix |
| Dark theme (consistent) | Expected for a "tech/lab" aesthetic brand; out-of-scope to add toggle | Low | Already decided: dark-only |
| Scroll animations (tasteful) | Motion signals frontend craft; missing feels static and 2019 | Med | Framer Motion already in use |
| Footer with social + copyright | Professional closer | Low | Exists; minor cleanup |
| Loading screen / skeleton | Prevents flash of unstyled content; signals attention to UX | Low | Exists; needs to handle 3D model load |

---

## Differentiators

Features that set this portfolio apart. Recruiters and engineers remember these. Most personal portfolios have zero of them.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Interactive 3D robot with emotion-based animations** | The centerpiece — proves AI + frontend skills in a single interaction. No other portfolio does "LLM controls 3D character emotions." | High | Core constraint: .glb model provided by owner; React Three Fiber + drei + Zustand for animation state |
| **Chatbot that answers as the portfolio owner** | Recruiters can "interview" the robot; it's memorable and demonstrates LLM integration skills | Med-High | API response format `{ answer, emotion }` drives robot state; must gracefully handle API unavailability |
| **Blog with technical depth (series, code, TOC)** | Demonstrates ongoing learning, thought leadership, NLP/LLM domain expertise through writing | Med | Markdown files in repo; no CMS; MDX for code blocks and components |
| **Bilingual (Vietnamese + English)** | Rare among Vietnamese AI engineers; signals professionalism and reach; appeals to both local and international recruiters | Med | next-intl recommended over custom solution; static export compatible |
| **Skill-in-action design language** | The site itself is a working demo — clean code, RTF rendering, chatbot, animations, i18n all together show full-stack AI engineering | Med | Cumulative effect; no single feature, but the whole must feel intentional |
| **"Lab aesthetic" consistent visual identity** | RAGFlow-style grid/caro dark background is distinctive and memorable; signals an AI practitioner's workspace not a generic dev portfolio | Low | Tailwind CSS variable system; define once, use everywhere |
| **Structured data (JSON-LD Person schema)** | Enhances Google Knowledge Panel likelihood; signals SEO craft beyond basics | Low | Already partially implemented; extend for blog posts with Article schema |
| **Project detail pages with case studies** | Goes beyond screenshot + link — explains the problem, approach, and impact; rare depth for portfolios | Med | Needs routing; blog-style content for each project |
| **"Wall-E can love again" narrative voice** | Memorable tagline and conceptual hook; humanizes technical content | Low | Copy / content decision; must be consistent across all sections |

---

## Anti-Features

Features to explicitly NOT build. Each has a reason grounded in project goals or complexity budget.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Light mode / theme toggle | Adds implementation complexity, visual inconsistency; dark lab aesthetic is the brand identity | Commit to dark-only; ensure contrast ratios meet WCAG AA |
| Contact form with email backend | Needs a backend or third-party service (Resend, Formspree); adds GDPR/spam surface; not a portfolio convention | Footer social links + direct email href are sufficient |
| Real-time WebSocket chat | Adds server complexity for zero user benefit in a portfolio context; standard HTTP request/response is imperceptible for a chatbot | HTTP POST to LLM endpoint; show typing indicator client-side |
| CMS / admin panel for blog | Overkill for a personal blog; adds auth, hosting, ops cost; undermines the "developer manages own content" story | Markdown (.md / .mdx) files in repo, committed with code |
| User authentication / sessions | No content requires gating; adds attack surface and complexity | Fully public portfolio; no login |
| Animated/video hero background | Competes with robot for visual focus; slows load; robot IS the motion | Static black hole image behind robot |
| Comment system on blog | Requires moderation, spam handling, auth; low ROI on a portfolio blog | If needed later: link to GitHub Discussions or Twitter/X thread per post |
| Analytics dashboard | Not needed for a portfolio; adds script weight | Optional: add minimal privacy-respecting analytics (Plausible) in a future phase if traffic data is wanted |
| Infinite scroll on projects | Premature optimization for 4-8 projects; adds complexity | Paginate or "show more" only when project count exceeds visible threshold (~8) |
| Full search with indexing server | Overkill; static client-side search is sufficient for a blog with <100 posts | Fuse.js or pagefind for client-side search over front-matter metadata |
| Mobile app / PWA | Web-only; PWA manifest is optional nice-to-have, not a priority | Focus on responsive web |
| Multi-author blog | Personal portfolio; one author by definition | Single-author blog model |

---

## Feature Dependencies

```
CV Download fix (basePath)
  └── blocker for: nothing actively broken, but will break in production

i18n (next-intl routes /en /vi)
  └── requires: all page content extracted to translation keys
  └── requires: blog content duplicated or language-flagged per post
  └── requires: hreflang 404 fix (currently declares routes that don't exist)
  └── enables: international SEO, Vietnamese recruiter reach

3D Robot (React Three Fiber + .glb model)
  └── requires: .glb file from owner
  └── requires: Suspense + loading fallback (placeholder)
  └── requires: animation clip names mapped to emotion enum
  └── enables: visual identity, chatbot emotion feedback

Chatbot (LLM API integration)
  └── requires: 3D Robot (robot reacts to emotion in response)
  └── requires: API endpoint (currently placeholder `test/api/v1/...`)
  └── requires: mock/fallback for when API is unavailable
  └── enables: recruiter "interview" experience, AI skill demonstration

Blog system (MDX + Velite or Contentlayer2)
  └── requires: MDX processing pipeline
  └── requires: routing (/blog, /blog/[slug])
  └── requires: static export compatibility (getStaticPaths equivalent)
  └── enables: tag pages, series pages, TOC, RSS feed
  └── warning: static export (`output: 'export'`) limits some dynamic blog patterns

Blog search
  └── requires: blog system
  └── requires: client-side search library (Fuse.js or pagefind)
  └── NOT compatible with server-side search

Blog TOC (Table of Contents)
  └── requires: blog system
  └── requires: MDX headings parsed at build time
  └── enables: long-form technical articles to feel navigable

Project detail pages
  └── requires: routing setup (/projects/[slug])
  └── requires: project data structure (markdown or TypeScript data file)
  └── compatible with static export via generateStaticParams

Scroll animations (existing, extend)
  └── requires: Framer Motion (already installed)
  └── warning: do not animate 3D canvas — use CSS/Framer only for 2D DOM elements

SEO / structured data (extend for blog)
  └── requires: blog system (for Article JSON-LD per post)
  └── requires: i18n routes to actually exist (hreflang fix)
  └── requires: sitemap to include blog post URLs
```

---

## MVP Recommendation

Given the project already has a working base (Hero, Introduce, Projects, Footer, SEO), the MVP milestone should be:

**Priority 1 — Core identity + centerpiece (what makes this portfolio memorable):**
1. 3D robot in hero section (React Three Fiber, placeholder model until .glb delivered)
2. Chatbot sticky bar with mock LLM responses driving robot emotion state
3. Hero section redesign (black hole static background + robot foreground)
4. Dark lab aesthetic — grid/caro background established as CSS variable system

**Priority 2 — Content depth (what builds credibility):**
5. About/story section (real content, storytelling format)
6. Projects section with data-driven cards + detail pages
7. Blog system (MDX from .md files, TOC, code highlighting, tags)

**Priority 3 — Polish + reach (what makes it professional and discoverable):**
8. i18n (Vietnamese + English via next-intl)
9. Full SEO pass (Article schema per post, hreflang fix, sitemap with blog URLs)
10. Scroll animations audit (ensure tasteful across all new sections)

**Defer:**
- Blog search: Defer until blog has >10 posts (Fuse.js takes 1 day but ROI is low early)
- RSS feed: Defer post-blog-launch (nice-to-have, not blocking)
- Blog series grouping: Defer until there are 2+ posts in a series
- Analytics: Defer entirely unless traffic measurement becomes a goal

---

## Feature Complexity Reference

| Feature | Est. Effort | Key Risk |
|---------|-------------|----------|
| 3D robot rendering (R3F + animations) | High (5-8 days) | .glb file dependency; performance on mobile; animation clip mapping |
| Chatbot (HTTP + emotion state) | Med (2-3 days) | API unavailability fallback; Zustand state for robot emotion; loading states |
| Blog system (MDX + routing) | Med (3-4 days) | Static export compatibility; TOC from headings; code highlighting |
| i18n (next-intl, 2 locales) | Med (2-3 days) | All content in translation keys; blog content strategy; route restructure |
| Hero redesign (static bg + robot) | Low-Med (1-2 days) | CSS layering of static image + R3F canvas; z-index discipline |
| About section (content + layout) | Low (1 day) | Content creation; storytelling format design |
| Project detail pages | Low-Med (1-2 days) | Routing setup; markdown or TS data source |
| Scroll animations (extend) | Low (0.5 day) | Don't over-animate; review on mobile |
| SEO pass + hreflang fix | Low (0.5 day) | Fix existing 404 hreflang before adding more |
| Blog search (Fuse.js) | Low (0.5 day) | Client-side only; no server needed |

---

## Sources

- Next.js App Router i18n documentation: https://nextjs.org/docs/app/guides/internationalization (verified current, 2026-02-27)
- Project requirements: `.planning/PROJECT.md` (authoritative, owner-defined)
- Codebase audit: `.planning/codebase/STACK.md`, `ARCHITECTURE.md`, `CONCERNS.md`, `INTEGRATIONS.md`
- React Three Fiber: Known ecosystem (HIGH confidence — widely used, stable since 2019, pmndrs.rs maintained)
- next-intl: Recommended by Next.js official docs as primary i18n library; App Router compatible
- Framer Motion 12 (already installed): scroll animations, `useInView`, spring transitions
- Fuse.js: Client-side fuzzy search, well-established for static sites (no server needed)
- MDX with Next.js: Official Next.js feature, stable for App Router + static export
- Confidence: HIGH for table stakes (industry standard), MEDIUM for differentiators (owner-defined, not market-validated), HIGH for anti-features (explicitly scoped out in PROJECT.md)
