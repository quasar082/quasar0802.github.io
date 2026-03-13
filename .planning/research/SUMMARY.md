# Project Research Summary

**Project:** RayQuasar Portfolio — AI Engineer with 3D Robot Chatbot
**Domain:** Interactive personal portfolio — 3D WebGL, LLM chatbot, bilingual content, markdown blog
**Researched:** 2026-03-13
**Confidence:** HIGH (core stack + architecture); MEDIUM (MDX/React 19 compat, next-intl static export edge cases)

## Executive Summary

This is a Next.js 15 static export portfolio deployed on GitHub Pages, distinguished by two centerpiece features no other personal portfolio combines: an interactive 3D robot character (React Three Fiber + GLTF) whose animations are driven by live LLM responses, and a bilingual (English/Vietnamese) presentation layer. The existing codebase is a functional single-page app with working scroll animations, SEO, and four hardcoded project cards — but it is missing the entire 3D subsystem, chatbot integration, i18n routing, and blog. The recommended approach is to build on the existing foundation in strict dependency order: restructure to `app/[lang]/` routing first, then the 3D robot and chatbot, then content sections, then the blog, and finally a SEO/performance polish pass.

The most important architectural constraint is `output: 'export'`. This single decision eliminates middleware-based i18n, Next.js API route proxies for the chatbot, server-side search, and any CMS. Every library choice is filtered through this constraint. The recommended stack is well-resolved: `@react-three/fiber` 9.x + `@react-three/drei` 10.x for 3D (React 19 peer deps confirmed), `next-intl` 4.x for i18n (static export via `generateStaticParams` confirmed from official example), `gray-matter` + `next-mdx-remote/rsc` for blog, `fuse.js` for client-side search, and a plain `fetch()` wrapper for the chatbot. No AI SDK, no CMS, no WebSocket.

The highest-risk areas are the R3F + static export build crash (guaranteed if not guarded with `dynamic({ ssr: false })`), CORS configuration on the external LLM backend, and the existing pre-existing bugs (missing `"use client"` directives, broken `basePath` for asset URLs, hreflang 404s) that will compound any new feature if not fixed in Phase 1. The LLM's `emotion` response field must be validated and normalized before reaching the animation system — an unguarded string from an LLM is a runtime crash waiting to happen. These risks are all well-understood and have clear prevention strategies documented in PITFALLS.md.

---

## Key Findings

### Recommended Stack

The existing stack (Next.js 15.3.1 / React 19.1.0 / TypeScript 5.8 / Tailwind CSS 4 / Framer Motion 12 / Zustand 5) is kept as-is. All new packages are additive and have been verified against npm registry and GitHub releases as of 2026-03-13.

**Core new technologies:**
- `@react-three/fiber` 9.5.0 + `three` 0.183.2 + `@react-three/drei` 10.7.7 — 3D robot rendering with GLTF support, animation mixer abstraction, and IBL lighting. R3F v9 is the React 19-compatible release. All peer deps satisfied.
- `next-intl` 4.8.3 — i18n with `generateStaticParams` pattern (no middleware required). Official next-intl example confirms the static export approach with `[locale]/layout.tsx`.
- `gray-matter` 4.0.3 + `next-mdx-remote` (latest) — Build-time frontmatter parsing + MDX compilation for blog. `contentlayer` rejected (archived 2024); `velite` rejected (low adoption, unnecessary complexity).
- `rehype-pretty-code` 0.14.3 + `shiki` 4.0.2 + `remark-gfm` 4.0.1 + `rehype-slug` + `rehype-autolink-headings` — Blog content pipeline with build-time syntax highlighting. All run at build time, zero runtime JS cost.
- `@tailwindcss/typography` 0.5.19 — `prose` class for MDX-rendered HTML. Confirmed Tailwind v4 compatibility.
- `fuse.js` 7.1.0 — Client-side fuzzy search over blog metadata. No server needed. Appropriate scale (<100 posts).
- `fetch()` only for chatbot — No Vercel AI SDK (designed for API routes; incompatible with static export). No `openai` package (would expose API key client-side). Zustand (`useChatStore`) already installed handles all state.

**One version flag:** `next-mdx-remote` React 19 compatibility should be verified at install time. Fallback: `mdx-bundler`.

### Expected Features

**Must have (table stakes):**
- Hero section with name + role — already partially exists; needs robot integration
- About / story section — stub exists; needs real content
- Projects showcase (data-driven, not hardcoded) + CV download (basePath bug fix required)
- Contact/social links, responsive design, fast load (sub-3s), SEO fundamentals
- Scroll animations (Framer Motion, already in use), consistent dark theme, loading screen extended for 3D

**Should have (differentiators — what makes this memorable):**
- Interactive 3D robot with emotion-based animations driven by LLM response — the centerpiece; no comparable portfolio does this
- Chatbot that lets recruiters "interview" the portfolio owner via the robot character
- Technical blog with MDX, code highlighting, TOC, tag filtering — demonstrates ongoing thought leadership
- Bilingual (Vietnamese + English) — rare among Vietnamese AI engineers; signals professionalism
- "Lab aesthetic" visual identity (dark grid/caro background, consistent CSS token system)
- Project detail pages with case studies (not just screenshots)
- Structured data (JSON-LD Person + Article schema) for SEO Knowledge Panel

**Defer to v2+:**
- Blog search (Fuse.js) — defer until >10 posts exist; 1 day to add but low ROI early
- RSS feed — post-blog-launch nicety
- Blog series grouping — defer until 2+ posts share a series
- Analytics (Plausible or similar) — only if traffic data becomes a goal

**Explicit anti-features (do not build):**
- Light mode toggle, contact form backend, real-time WebSocket chat, CMS/admin panel, user auth, animated video hero background, comment system on blog

### Architecture Approach

The architecture follows a layered model: App Router routing shell (`app/[lang]/`) wraps all routes and provides the IntlProvider and ChatWidget portal; section components compose the home page scroll experience; the 3D robot subsystem (RobotCanvas, RobotScene, RobotModel, EmotionController) is isolated in `components/robot/` and communicates with the chatbot subsystem exclusively via `useRobotStore` (Zustand); the blog data layer (`lib/blog.ts` + `lib/mdx.ts`) is fully build-time and independent of all other subsystems. The directory structure separates robot, chat, blog, and shared UI into distinct component folders.

**Major components:**
1. `app/[lang]/layout.tsx` — HTML shell, IntlProvider, ChatWidget portal, SEO metadata
2. `RobotCanvas` + `RobotModel` + `EmotionController` — isolated R3F renderer, GLTF + AnimationMixer, emotion-to-clip mapping
3. `useChatStore` + `useRobotStore` (Zustand) — the state bridge that crosses the R3F Canvas boundary (React Context cannot cross this boundary; Zustand can)
4. `ChatWidget` + `chatApi` — sticky chat UI + plain `fetch()` to external LLM endpoint
5. `lib/blog.ts` + `lib/mdx.ts` — build-time frontmatter parsing and MDX compilation; fully static
6. `messages/en.json` + `messages/vi.json` — i18n dictionaries; loaded at layout level

**Key isolation rule:** R3F's `<Canvas>` creates its own React root. React Context from the DOM tree is not accessible inside it. Zustand (module-level closure) is the only correct bridge.

### Critical Pitfalls

1. **R3F + static export SSR crash (C-1)** — `window is not defined` at build time. Prevention: every R3F import must be wrapped in `dynamic(() => import(...), { ssr: false })`. This will silently fail in dev (Turbopack handles it) and only crash in `npm run build`. Must be the first task of the 3D phase.

2. **i18n middleware incompatibility with static export (C-2)** — Middleware is a server concept; static export has no server. Do NOT create `middleware.ts`. Use `app/[lang]/` + `generateStaticParams` only. The existing `layout.tsx` already declares hreflang alternates for `/vi` and `/en` that 404 — fix or remove before adding more.

3. **GLTF model 404 in production (C-3)** — Same `basePath` bug as the existing CV download. Create a `useModelPath()` hook that applies `NEXT_PUBLIC_BASE_PATH` to all asset URLs. Apply to every `useGLTF()` call.

4. **AnimationMixer memory leak on unmount (C-4)** — Three.js WebGL resources do not GC automatically. Use `drei`'s `useAnimations` hook (handles mixer lifecycle) and add explicit geometry/material dispose on component cleanup. Use opacity toggle instead of conditional render to keep the Canvas mounted.

5. **Chatbot CORS failure in production (M-6)** — `fetch()` from GitHub Pages to the LLM backend will be blocked unless the backend sets `Access-Control-Allow-Origin: https://rayquasar18.github.io`. This is a backend configuration dependency. Implement fallback mock mode for when the API is unreachable. Coordinate before writing integration code.

6. **Pre-existing bugs compound new features (N-4 / CONCERNS.md)** — Missing `"use client"` on `IntroduceSection` and `ProjectSection`, broken `basePath` on CV download, `metadata.title.template` misconfiguration, and scroll magic numbers (`h-[1100vh]`, hardcoded offsets) will all break silently when new routes and sections are added. Must be fixed in Phase 1.

---

## Implications for Roadmap

Research is unambiguous about build order. Dependencies are hard: the `[lang]` route structure must exist before any page can use i18n; the `useRobotStore` must exist before the chatbot can control animations; blog routing requires the `[lang]` prefix. Recommended phase structure below mirrors the dependency graph directly.

### Phase 1: Foundation — Codebase Cleanup + i18n Routing
**Rationale:** Every subsequent feature depends on the `app/[lang]/` route structure. This phase also eliminates the pre-existing bugs that would compound all future work. It produces no visible user-facing changes but is the structural prerequisite for everything else.
**Delivers:** `app/[lang]/layout.tsx` with `generateStaticParams`, `next-intl` setup, `messages/en.json` + `messages/vi.json` skeletons, Header language switcher, dark theme CSS token system, fixed `"use client"` directives, fixed CV download basePath, removed/corrected hreflang alternates, scroll math refactor (`useRef`-measured heights, named scroll constants).
**Addresses features:** Bilingual i18n, dark lab aesthetic, working links (hreflang fix), CV download
**Avoids pitfalls:** C-2 (no middleware), N-4 (fix client directives), M-4 (scroll refactor before new sections), existing basePath bug
**Research flag:** Standard Next.js pattern — skip `/gsd:research-phase`. The `generateStaticParams` + `next-intl` static export approach is confirmed from official sources.

### Phase 2: 3D Robot + Chatbot (The Centerpiece)
**Rationale:** This is the core differentiator. Building it while the codebase is minimal reduces conflict surface. The robot's `RobotCanvas` + `useRobotStore` can be built with a placeholder primitive (box geometry) before the `.glb` file is delivered. The chatbot can be built against a mock endpoint. These two subsystems are co-dependent (chatbot drives robot emotion) and belong in the same phase.
**Delivers:** Full robot subsystem (`RobotCanvas`, `RobotScene`, `RobotModel`, `EmotionController`, `useRobotStore`), full chatbot subsystem (`ChatWidget`, `ChatInput`, `ChatMessage`, `useChatStore`, `chatApi`), mock fallback mode for API unavailability, emotion validation/normalization, WebGL cleanup on unmount.
**Uses:** `@react-three/fiber`, `three`, `@react-three/drei`, `useGLTF.preload()`, `useAnimations`, `dynamic({ ssr: false })`, Zustand (existing), `fetch()`
**Avoids pitfalls:** C-1 (dynamic import), C-3 (useModelPath hook), C-4 (useAnimations + dispose), C-5 (dvh units, safe-area-inset, real iOS test), M-1 (emotion validation), M-3 (bundle-analyzer audit), M-6 (CORS coordination), N-3 (keep Canvas mounted)
**Research flag:** Needs `/gsd:research-phase` if the `.glb` animation clip names are unknown before implementation — clip names must match the `RobotEmotion` TypeScript union type exactly. Also flag CORS resolution as a blocking external dependency.

### Phase 3: Hero Section Redesign
**Rationale:** Short phase; requires Phase 2's `RobotCanvas` and `useRobotStore` to exist. Integrates the 3D robot into the scroll-driven hero layout with the static black hole background.
**Delivers:** `HeroSection` rebuilt with static background image + `RobotCanvas` overlay (`position: absolute`, `gl.alpha = true`), scroll-driven robot transform, proper z-index layering.
**Avoids pitfalls:** Anti-pattern of full-page fixed canvas; existing fragile `h-[1100vh]` already fixed in Phase 1.
**Research flag:** Standard CSS layering + R3F Canvas — skip research.

### Phase 4: Content Sections
**Rationale:** IntroduceSection, AboutSection, ProjectSection are independent of the 3D/chat subsystems and only require Phase 1 (for i18n hooks). They can proceed immediately after Phase 1 is complete, in parallel with Phase 2 if developer bandwidth allows. Project detail pages require routing setup but are self-contained.
**Delivers:** Rebuilt IntroduceSection (storytelling format), AboutSection (skills + experience), data-driven ProjectSection (replaces hardcoded 4 cards), project detail pages (`app/[lang]/projects/[slug]/page.tsx`), scroll animations audit across all new sections.
**Addresses features:** About/story section, projects showcase, project detail pages
**Research flag:** Standard content sections — skip research.

### Phase 5: Blog System
**Rationale:** The blog data layer (gray-matter, mdx processing) is fully independent of 3D, chatbot, and content sections. It only requires Phase 1 routing for `app/[lang]/blog/` structure. Isolating it to its own phase avoids the Turbopack/MDX compatibility risk bleeding into other features.
**Delivers:** `lib/blog.ts` (frontmatter parsing), `lib/mdx.ts` (MDX compilation), `content/blog/` directory structure (locale-per-directory), blog index page with tag filter, blog post detail page with TOC + code highlighting + `generateMetadata()` for OG images, `BlogSection` home preview, `@tailwindcss/typography` prose styling. Blog search (Fuse.js) deferred until >10 posts.
**Avoids pitfalls:** M-2 (locale-per-directory content structure), M-5 (next-mdx-remote over @next/mdx for Turbopack compat), N-1 (generateMetadata with absolute URLs), N-5 (pre-built search-index.json at build time)
**Research flag:** Verify `next-mdx-remote` React 19 compatibility at the start of this phase before writing any blog content pipeline. If incompatible, switch to `mdx-bundler`.

### Phase 6: SEO + Performance Polish
**Rationale:** SEO requires final page content and structure to be complete. Performance optimization (bundle analysis, lazy loading audit) requires all features to be in place so measurements are accurate.
**Delivers:** OG images per blog post and project page, JSON-LD Article schema per post + Person schema cleanup, sitemap extended to include all blog and project routes, `@next/bundle-analyzer` audit (Three.js chunk target: <200KB gzipped), Lighthouse audit and remediation, final mobile testing on real iOS device.
**Research flag:** Standard SEO patterns — skip research. Performance targets are already defined.

### Phase Ordering Rationale

- Phase 1 is a structural prerequisite for all other phases — route shape determines all file paths
- Phases 2 and 4 can run in parallel after Phase 1 (no shared dependencies), but Phase 2 is higher risk and should be prioritized
- Phase 3 is a short integration phase that gates on Phase 2
- Phase 5 is deliberately isolated — blog is the highest-complexity content pipeline and benefits from a clean stable base
- Phase 6 cannot begin until all content is final — premature performance work is wasted

### Research Flags

**Needs `/gsd:research-phase` during planning:**
- Phase 2 (3D Robot): GLTF animation clip names must match the `RobotEmotion` TypeScript union before implementation. If the `.glb` file is not yet available, use a placeholder and note this as a blocking external dependency.
- Phase 5 (Blog): Verify `next-mdx-remote` version against React 19 before committing to the pipeline.

**Standard patterns (skip research-phase):**
- Phase 1 (i18n Foundation): Official Next.js + next-intl docs confirm the exact pattern.
- Phase 3 (Hero Redesign): CSS layering + R3F Canvas overlay is documented.
- Phase 4 (Content Sections): Standard React sections with i18n hooks.
- Phase 6 (SEO/Polish): Established Next.js metadata patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry (2026-03-13). Peer dep matrix fully resolved. One flag: next-mdx-remote React 19 compat needs runtime verification at install. |
| Features | HIGH | Table stakes are industry standard. Differentiators are owner-defined in PROJECT.md (authoritative). Anti-features are explicitly scoped out. |
| Architecture | HIGH | Static export constraint is non-negotiable and shapes all decisions. R3F Canvas isolation + Zustand bridge is canonical community pattern. i18n pattern confirmed from official next-intl example source. |
| Pitfalls | HIGH | Derived from direct codebase audit (CONCERNS.md) + domain knowledge. The C-1/C-2/C-3 pitfalls are deterministic and have verified prevention strategies. |

**Overall confidence:** HIGH

### Gaps to Address

- **`.glb` animation clip names unknown:** The `RobotEmotion` TypeScript union and `EmotionController` clip mapping depend on knowing the exact clip names embedded in the `.glb` file. This is a blocking external dependency. Resolution: get the `.glb` file early in Phase 2, run `console.log(gltf.animations.map(a => a.name))` to extract clip names, define the enum before building `EmotionController`.
- **LLM backend CORS headers:** The chatbot only works if the backend sets `Access-Control-Allow-Origin` for the GitHub Pages domain. This must be coordinated with the backend provider before Phase 2 integration work begins. Risk if not done: silent production failure.
- **`next-mdx-remote` React 19 compatibility:** Widely used and actively maintained, but the exact React 19 peer dep compatibility should be verified at install time (Phase 5). The fallback is `mdx-bundler`.
- **Blog content strategy for Vietnamese:** Architecture recommends `content/blog/en/` and `content/blog/vi/` directory structure. Initially, English-only is acceptable; Vietnamese posts can be added per-slug later. This decision should be made explicit in Phase 5 planning to avoid a later migration.

---

## Sources

### Primary (HIGH confidence)
- npm registry live queries (2026-03-13) — all package versions verified
- GitHub release API (2026-03-13): pmndrs/react-three-fiber v9.5.0, amannn/next-intl v4.8.3
- Next.js official i18n docs (fetched 2026-03-13): https://nextjs.org/docs/app/guides/internationalization
- next-intl `example-app-router` source (amannn/next-intl GitHub, 2026-03-13) — confirms `generateStaticParams` + `setRequestLocale` for static export
- Existing codebase audit: `.planning/codebase/STACK.md`, `ARCHITECTURE.md`, `CONCERNS.md`, `INTEGRATIONS.md`, `STRUCTURE.md`
- Project requirements: `.planning/PROJECT.md` (authoritative, owner-defined)

### Secondary (MEDIUM confidence)
- R3F Canvas isolation behavior and Zustand bridge pattern — community consensus, documented R3F behavior
- `next-mdx-remote/rsc` compatibility with Next.js 15 / React 19 — widely used, actively maintained, not runtime-verified for this exact version combination
- `next-intl` static export full feature parity — confirmed in docs, minor edge cases possible during implementation

### Tertiary (needs validation at implementation)
- `next-mdx-remote` React 19 peer dep — verify at `npm install` time
- GLTF animation clip names in the owner-provided `.glb` file — unknown until file is received
- LLM backend CORS configuration for `https://rayquasar18.github.io` — external dependency, not under portfolio codebase control

---

*Research completed: 2026-03-13*
*Ready for roadmap: yes*
