# Technology Stack

**Project:** RayQuasar Portfolio — AI Engineer with 3D Robot Chatbot
**Researched:** 2026-03-13
**Overall Confidence:** HIGH for core stack (versions verified against npm registry and GitHub releases); MEDIUM for blog pipeline (next-mdx-remote React 19 compat needs runtime verification)

---

## Critical Constraint: Static Export

Every library choice below is filtered through one non-negotiable constraint:

```
output: 'export'  →  GitHub Pages  →  No server, no middleware, no API routes
```

This eliminates: server-side i18n routing, Next.js API route proxies for chatbot, server-side search. It shapes every category below.

---

## Current Stack (Existing — Keep)

| Technology | Version | Role |
|------------|---------|------|
| Next.js | 15.3.1 | Framework, App Router, static export |
| React | 19.1.0 | UI rendering |
| TypeScript | 5.8.3 | Type safety |
| Tailwind CSS | 4.1.4 | Utility-first styling |
| Framer Motion | 12.7.4 | DOM scroll animations, entrance effects |
| Zustand | 5.0.3 | Global state management |
| lucide-react | 0.488.0 | Icon library |
| next-sitemap | 4.2.3 | Sitemap + robots.txt generation |
| Turbopack | (bundled) | Dev server |
| npm | — | Package manager |

All existing dependencies are kept as-is. New packages listed below are additive.

---

## New Packages: 3D Rendering

### @react-three/fiber — 9.5.0

**Purpose:** React renderer for Three.js. Declarative scene graph, hooks-based animation loop, full Three.js feature access.

**Why this, not alternatives:**
- Only mature React-native Three.js integration. Direct Three.js would mean managing a separate imperative scene outside React's component model.
- Version 9.x is the React 19-compatible release (peer: `react >=19 <19.3`). Project has React 19.1.0 — fits cleanly.
- `peerDependenciesMeta` marks all native/expo peers as optional, so web-only installs are clean.
- Released 2025-12-30 (v9.5.0). Actively maintained by pmndrs.

**Install:**
```bash
npm install @react-three/fiber three
```

**Confidence:** HIGH — verified via npm registry + GitHub release (v9.5.0, 2025-12-30).

---

### three — 0.183.2

**Purpose:** Three.js core — 3D engine. GLTFLoader, AnimationMixer, WebGLRenderer.

**Why this version:** Latest stable as of 2026-03-13. R3F peer requires `>=0.156`; drei peer requires `>=0.159`. 0.183.2 satisfies both.

**Confidence:** HIGH — verified npm registry.

---

### @react-three/drei — 10.7.7

**Purpose:** Utility components and helpers for R3F. Used for:
- `useGLTF` — loads `.glb` / `.gltf` robot model with caching and preload support
- `useGLTF.preload` — preloads model before Canvas mounts, eliminates pop-in
- `useAnimations` — connects Three.js AnimationMixer to GLTF animation clips declaratively
- `Environment` — IBL lighting without custom shader setup
- `Suspense`-compatible `Html` — renders DOM fallback inside Canvas during load
- `PerspectiveCamera` — declarative camera control

**Why drei, not manual Three.js utilities:**
- `useGLTF` handles the draco/meshopt decoder configuration that is otherwise a manual multi-step setup.
- `useAnimations` eliminates boilerplate AnimationMixer setup; returns `{ actions, mixer }` keyed by clip name — maps directly to the `emotion → clip name` pattern in EmotionController.

**Peer requirements:** `react ^19`, `three >=0.159`, `@react-three/fiber ^9.0.0` — all satisfied.

**Released:** 2025-11-13 (v10.7.7).

**Install:**
```bash
npm install @react-three/drei
```

**Confidence:** HIGH — verified npm registry + GitHub release.

---

## New Packages: Internationalization

### next-intl — 4.8.3

**Purpose:** Full i18n solution for Next.js App Router. Translation hooks, locale-aware formatting (dates, numbers), type-safe message keys.

**Static export compatibility:** CONFIRMED. The pattern is:

```
app/[lang]/layout.tsx   — generateStaticParams returns [{lang:'en'},{lang:'vi'}]
app/[lang]/layout.tsx   — loads messages/[lang].json, wraps in NextIntlClientProvider
```

No middleware required. `setRequestLocale(locale)` enables static rendering per page. Official next-intl example `example-app-router` uses `generateStaticParams` in `[locale]/layout.tsx` — confirmed from source (amannn/next-intl GitHub, 2026-03-13).

**Why next-intl, not alternatives:**
- `react-i18next`: Framework-agnostic, more boilerplate for Next.js App Router patterns, no built-in static params helper.
- `next-i18n-router`: Requires middleware — incompatible with static export.
- Manual JSON + custom hook: No type safety, no ICU plural/date formatting, high maintenance.
- `next-intl` is explicitly listed in Next.js official i18n docs as the recommended library for App Router.

**Peer requirements:** `next ^12-16`, `react >=16.8 || >=19` — fully satisfied.

**Released:** 2026-02-16 (v4.8.3). Actively maintained.

**Install:**
```bash
npm install next-intl
```

**Integration note:** `middleware.ts` must NOT be created. Locale is URL-segment-only (`/en/`, `/vi/`). Root `app/page.tsx` does a client-side redirect to `/en`.

**Confidence:** HIGH — version verified npm registry + GitHub release. Static export approach verified from official example source code.

---

## New Packages: Blog Data Layer

### gray-matter — 4.0.3

**Purpose:** Parses YAML/TOML frontmatter from `.md` files. Returns `{ data, content }` where `data` is the typed frontmatter object (title, date, tags, description, slug).

**Why gray-matter:**
- Minimal, zero-dependency frontmatter parser. Used by virtually every Next.js static blog in the ecosystem.
- Runs only at build time (`lib/blog.ts`). Zero runtime cost.
- No configuration required; works with standard YAML frontmatter.

**Why NOT velite:** Velite (v0.3.1, 752 GitHub stars, last release 2025-12-08) is a more opinionated content pipeline that competes with contentlayer. It requires esbuild, sharp, terser as peers and generates a `.velite/` output directory. For this project's needs (parse frontmatter + compile MDX), gray-matter + next-mdx-remote is simpler and fully under our control without build pipeline complexity.

**Why NOT contentlayer:** Project archived in 2024. Community fork `contentlayer2` has uncertain maintenance. Already documented as an anti-pattern in ARCHITECTURE.md.

**Install:**
```bash
npm install gray-matter
```

**Confidence:** HIGH — npm verified (v4.0.3). No peer deps. Stable since 2018.

---

### next-mdx-remote — (latest compatible with React 19)

**Purpose:** Compiles markdown / MDX content to React components at build time. Used in `app/[lang]/blog/[slug]/page.tsx` via the `/rsc` import (React Server Component mode).

**Version note:** As of 2026-03-13, checking exact version requires npm lookup.

```bash
npm info next-mdx-remote version  # verify before install
```

**Usage pattern:**
```typescript
// app/[lang]/blog/[slug]/page.tsx (Server Component)
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

const { content } = await compileMDX({
  source: rawMdxString,
  options: {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
    },
  },
  components: { pre: CodeBlock, h2: HeadingWithAnchor },
})
```

**Why next-mdx-remote, not @next/mdx:**
- `@next/mdx` requires file-system-based MDX imports; doesn't support dynamic slug routing (`/blog/[slug]`).
- `next-mdx-remote/rsc` works with string content at runtime in Server Components, which is what `generateStaticParams` + `getPostBySlug()` needs.

**Confidence:** MEDIUM — actively maintained, widely used with Next.js 15. React 19 compatibility: flagged for verification during Phase 5 implementation. If issues arise, `mdx-bundler` is the fallback.

---

### remark-gfm — 4.0.1

**Purpose:** Adds GitHub Flavored Markdown (tables, strikethrough, task lists, autolinks) to the remark pipeline.

**Why:** Technical blog posts commonly use GFM tables for comparing options and task lists for roadmaps. Without remark-gfm, these render as plain text.

**Install:**
```bash
npm install remark-gfm
```

**Confidence:** HIGH — npm verified. Standard remark plugin.

---

### rehype-pretty-code — 0.14.3

**Purpose:** Syntax highlighting for code blocks via Shiki. Provides:
- Line highlighting with `{1,3-5}` notation
- Word highlighting
- Diff syntax (`+` / `-` line markers)
- Filename captions
- Copy-to-clipboard hook point

**Why rehype-pretty-code + Shiki, not alternatives:**
- `highlight.js`: CSS-class-based highlighting; less accurate, larger runtime payload.
- `prism-react-renderer`: React-specific, requires runtime JS; rehype-pretty-code runs at build time.
- `shiki` alone: Lower-level; rehype-pretty-code wraps it with the remark/rehype pipeline integration and adds the enhanced features above.

**Peer requirement:** `shiki ^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0` — use shiki v4.0.2.

**Install:**
```bash
npm install rehype-pretty-code shiki
```

**Confidence:** HIGH — npm verified. Peer requirement confirmed.

---

### rehype-slug — 6.0.0

**Purpose:** Adds `id` attributes to heading elements (`h2`, `h3`, etc.) based on their text content. Required for the Table of Contents anchor links to work.

**Install:**
```bash
npm install rehype-slug
```

**Confidence:** HIGH — npm verified. Standard rehype plugin.

---

### rehype-autolink-headings — 7.1.0

**Purpose:** Adds anchor link icons to headings (uses the `id` from rehype-slug). Enables click-to-copy section links.

**Install:**
```bash
npm install rehype-autolink-headings
```

**Confidence:** HIGH — npm verified.

---

### reading-time — 1.5.0

**Purpose:** Calculates estimated reading time from post content string. Added to `lib/blog.ts` frontmatter enrichment. Displayed in blog card and post header.

**Why:** Standard blog UX expectation. Zero complexity to add.

**Install:**
```bash
npm install reading-time
```

**Confidence:** HIGH — npm verified. No deps.

---

## New Packages: Blog Styling

### @tailwindcss/typography — 0.5.19

**Purpose:** Provides the `prose` CSS class that styles bare HTML from MDX output (headings, paragraphs, code, blockquotes, lists, tables) with carefully tuned typographic defaults.

**Why this is required:** Without it, MDX-rendered HTML inherits no Tailwind styles. `prose dark:prose-invert` applied to the blog post wrapper is the standard solution.

**Tailwind v4 compatibility:** Confirmed — peer requires `tailwindcss >=3.0.0 || >=4.0.0-beta.1`. Project uses Tailwind v4.1.4.

**Install:**
```bash
npm install @tailwindcss/typography
```

**Confidence:** HIGH — peer dependency explicitly lists Tailwind v4 support.

---

## New Packages: Blog Search

### fuse.js — 7.1.0

**Purpose:** Client-side fuzzy search over blog post metadata (title, description, tags). Runs in the browser; no server needed.

**Why fuse.js, not flexsearch:**
- `flexsearch` (v0.8.212): Better full-text search performance at scale, but more complex API and larger bundle. Overkill for a blog with <100 posts.
- `fuse.js`: Simple key-based fuzzy matching over an array of objects, 10-second integration. Blog index page pre-loads all `Post[]` metadata (not content) — ideal fuse.js use case.

**Why not pagefind:**
- Pagefind requires a separate CLI build step that indexes HTML output. With a Git-based deploy workflow, this adds friction without meaningful benefit at this scale.

**Install:**
```bash
npm install fuse.js
```

**Confidence:** HIGH — npm verified (v7.1.0). Long-established library, no deps.

---

## Chatbot: No New Packages

The chatbot calls an external LLM API directly with `fetch()`. This is intentional.

```typescript
// lib/chatApi.ts
export async function sendMessage(text: string): Promise<{ answer: string; emotion: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LLM_API_URL}/api/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  })
  if (!res.ok) throw new Error('LLM API error')
  return res.json()
}
```

**Why no AI SDK (Vercel AI SDK v4.x):**
- AI SDK is designed for Next.js API routes with streaming (`useChat` hook calls `/api/chat` on the same Next.js server). Static export has no API routes.
- The external LLM API returns `{ answer, emotion }` — a simple non-streaming JSON response. `fetch()` is sufficient.
- Adding AI SDK just to wrap a `fetch()` call adds 200KB+ to the bundle with zero benefit.

**Why no `openai` npm package:**
- The backend is the owner's own LLM service, not OpenAI directly. The client should call the backend API, not OpenAI.
- Even if it were OpenAI, exposing the API key client-side (required with static export) is a security violation. The backend proxy handles that.

**State management:** `useChatStore` (Zustand — already installed) handles messages array, loading state, error state. No additional library needed.

**Confidence:** HIGH — architectural decision, no version ambiguity.

---

## Alternatives Considered and Rejected

| Category | Recommended | Alternative | Why Rejected |
|----------|-------------|-------------|--------------|
| 3D rendering | @react-three/fiber 9.x | Babylon.js React | No React renderer; imperative only; larger bundle |
| 3D rendering | @react-three/fiber 9.x | A-Frame | VR-first, not designed for portfolio UX; no React integration |
| i18n | next-intl 4.x | react-i18next | More boilerplate for Next.js App Router; no built-in static params helper |
| i18n | next-intl 4.x | next-i18n-router | Requires middleware — blocks static export |
| i18n | next-intl 4.x | Manual JSON + t() | No type safety, no plurals, no date formatting |
| Blog data | gray-matter | contentlayer | Archived 2024; community fork uncertain maintenance |
| Blog data | gray-matter | velite 0.3.x | Extra build pipeline (esbuild, sharp, terser peers); 752 stars = low adoption signal; gray-matter covers 100% of needs |
| Blog MDX | next-mdx-remote | @next/mdx | Cannot do dynamic slug routing; file-system imports only |
| Blog MDX | next-mdx-remote | mdx-bundler | More complex setup; dynamic bundle splitting not needed for static export |
| Code highlighting | rehype-pretty-code + shiki | prism-react-renderer | Runtime JS highlighting; runs at build time is always better |
| Code highlighting | rehype-pretty-code + shiki | highlight.js | CSS-class-based; less accurate; larger output |
| Blog search | fuse.js | flexsearch | Complex API; overkill for <100 posts |
| Blog search | fuse.js | pagefind | Requires extra CLI build step; friction in CI |
| Blog search | fuse.js | Algolia/Typesense | Requires a running search server; incompatible with static export |
| Chatbot | fetch() | Vercel AI SDK | Designed for API-route-based streaming; static export has no API routes |
| Chatbot | fetch() | openai npm | Exposes API key client-side; overkill for a proxy call to owner's API |

---

## Complete Install Command

```bash
# 3D rendering
npm install three @react-three/fiber @react-three/drei

# i18n
npm install next-intl

# Blog data layer
npm install gray-matter next-mdx-remote

# Blog remark/rehype plugins
npm install remark-gfm rehype-pretty-code shiki rehype-slug rehype-autolink-headings reading-time

# Blog styling
npm install @tailwindcss/typography

# Blog search
npm install fuse.js
```

No dev-only packages required from this list — all are runtime or build-time production dependencies.

---

## Version Matrix (Verified 2026-03-13)

| Package | Version | Source | Date Verified |
|---------|---------|--------|---------------|
| @react-three/fiber | 9.5.0 | npm registry + GitHub release | 2026-03-13 |
| @react-three/drei | 10.7.7 | npm registry + GitHub release | 2026-03-13 |
| three | 0.183.2 | npm registry | 2026-03-13 |
| next-intl | 4.8.3 | npm registry + GitHub release (2026-02-16) | 2026-03-13 |
| gray-matter | 4.0.3 | npm registry | 2026-03-13 |
| next-mdx-remote | (verify at install) | npm registry | 2026-03-13 |
| remark-gfm | 4.0.1 | npm registry | 2026-03-13 |
| rehype-pretty-code | 0.14.3 | npm registry | 2026-03-13 |
| shiki | 4.0.2 | npm registry | 2026-03-13 |
| rehype-slug | 6.0.0 | npm registry | 2026-03-13 |
| rehype-autolink-headings | 7.1.0 | npm registry | 2026-03-13 |
| reading-time | 1.5.0 | npm registry | 2026-03-13 |
| @tailwindcss/typography | 0.5.19 | npm registry | 2026-03-13 |
| fuse.js | 7.1.0 | npm registry | 2026-03-13 |

---

## Peer Dependency Compatibility Check

| Library | React req | Next.js req | Three.js req | Status |
|---------|-----------|-------------|--------------|--------|
| @react-three/fiber 9.5.0 | >=19 <19.3 | — | >=0.156 | React 19.1.0 ✓, Three 0.183.2 ✓ |
| @react-three/drei 10.7.7 | ^19 | — | >=0.159 | React 19.1.0 ✓, Three 0.183.2 ✓ |
| next-intl 4.8.3 | >=16.8 \|\| >=19 | ^12-16 | — | React 19.1.0 ✓, Next 15.3.1 ✓ |
| @tailwindcss/typography 0.5.19 | — | — | — | Tailwind 4.1.4 ✓ |
| rehype-pretty-code 0.14.3 | — | — | — | shiki ^1-4 → 4.0.2 ✓ |

All new packages are compatible with the existing stack.

---

## Environment Variables Required

```bash
# .env.local (new additions)
NEXT_PUBLIC_LLM_API_URL=http://localhost:8000   # chatbot backend base URL
# NEXT_PUBLIC_BASE_PATH already exists

# .env.production (new additions)
NEXT_PUBLIC_LLM_API_URL=https://your-llm-api.example.com
```

No server-side env vars are used (static export means no server to read them).

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| 3D stack (R3F + drei) | HIGH | npm verified, GitHub release confirmed, React 19 peer deps satisfied |
| i18n (next-intl) | HIGH | npm verified, GitHub release confirmed, static export pattern verified from official example source |
| Blog data (gray-matter) | HIGH | npm verified, zero-dep, stable since 2018, universally used |
| Blog MDX (next-mdx-remote) | MEDIUM | Actively maintained, widely used with Next 15. React 19 compat needs verification at install time |
| Code highlighting (rehype-pretty-code + shiki) | HIGH | npm verified, peer compat confirmed |
| Blog search (fuse.js) | HIGH | npm verified, long-established, no deps |
| Chatbot (fetch only) | HIGH | Architectural decision, no version ambiguity |

---

## Sources

- npm registry (live queries, 2026-03-13): @react-three/fiber, @react-three/drei, three, next-intl, gray-matter, rehype-pretty-code, shiki, remark-gfm, rehype-slug, rehype-autolink-headings, reading-time, @tailwindcss/typography, fuse.js
- GitHub API release verification (2026-03-13):
  - pmndrs/react-three-fiber: v9.5.0 released 2025-12-30
  - amannn/next-intl: v4.8.3 released 2026-02-16
  - zce/velite: v0.3.1 released 2025-12-08 (investigated and rejected)
- next-intl static export pattern: verified from `examples/example-app-router/src/app/[locale]/layout.tsx` in amannn/next-intl GitHub repo (2026-03-13) — `generateStaticParams` + `setRequestLocale` confirmed
- next-intl `example-app-router-without-i18n-routing` example: confirmed as cookie-based approach (NOT suitable for static export — `cookies()` requires a server)
- React Three Fiber README: pmndrs/react-three-fiber (fetched 2026-03-13)
- Existing codebase: `.planning/codebase/STACK.md` (2026-03-13)
- Project requirements: `.planning/PROJECT.md` (authoritative)

---

*Stack research: 2026-03-13*
