# Domain Pitfalls

**Project:** RayQuasar Portfolio — AI Engineer with 3D Robot Chatbot
**Domain:** Interactive portfolio — 3D WebGL, LLM chatbot, markdown blog, i18n
**Researched:** 2026-03-13
**Confidence:** HIGH (based on deep codebase audit + domain knowledge; web search unavailable)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deploys, or broken centerpiece features.

---

### Pitfall C-1: React Three Fiber + Next.js Static Export SSR Crash

**What goes wrong:** Three.js and React Three Fiber (R3F) access browser globals (`window`, `document`, `WebGLRenderingContext`) at module load time. In Next.js static export mode (`output: 'export'`), the build step runs in Node.js where these globals don't exist. Importing R3F without a dynamic import guard causes the entire build to crash with `ReferenceError: window is not defined` or silently corrupts the HTML output.

**Why it happens:** The existing codebase uses `"use client"` on `page.tsx` as a blanket boundary, which currently works because there's no WebGL. Adding R3F naively follows the same pattern — but `"use client"` does not prevent SSR execution during static export; it only marks the component as client-interactive for the React model. R3F's Canvas and Three.js internals still execute at build time.

**Consequences:** Build fails in CI. Entire site is undeployable until fixed. The issue only surfaces in `npm run build`, not during `npm run dev` (Turbopack dev server handles this differently).

**Prevention:**
```tsx
// WRONG — crashes static export build
import { Canvas } from "@react-three/fiber"

// CORRECT — lazy import bypasses SSR
import dynamic from "next/dynamic"
const RobotCanvas = dynamic(() => import("@/components/RobotCanvas"), {
  ssr: false,
  loading: () => <RobotFallback />, // show placeholder during hydration
})
```
Every file that imports `@react-three/fiber`, `@react-three/drei`, or `three` directly must either be inside a `dynamic(() => import(...), { ssr: false })` call or itself be lazily imported. Even utility files that import Three.js types need care with `typeof window !== 'undefined'` guards.

**Detection:** Run `npm run build` locally before merging. The crash is deterministic and immediate.

**Phase:** Phase that adds the 3D robot — must be resolved on day one of that phase.

---

### Pitfall C-2: i18n + Static Export Incompatibility (next-intl Configuration)

**What goes wrong:** The most natural i18n setup for Next.js App Router — locale segments in the URL path (e.g., `/en/`, `/vi/`) managed by middleware — does not work with `output: 'export'`. Next.js middleware runs on the edge runtime, which is incompatible with static HTML export. Attempting to use `next-intl` (or any middleware-based i18n library) with the standard routing configuration will either crash the build or silently produce a site that serves only the default locale.

**Why it happens:** The existing project uses `output: 'export'` (GitHub Pages static hosting). The `CONCERNS.md` audit already flagged that `metadata.alternates.languages` declares `/vi` and `/en` routes that don't exist — confirming this is unimplemented and will be a trap.

**Consequences:** Either the build breaks, or the site deploys with broken locale links and 404s on alternate-language URLs that are already declared in the existing `layout.tsx` hreflang metadata.

**Prevention:** Use `next-intl`'s "without i18n routing" mode (also called "setup without middleware"):
- Do NOT set up middleware-based locale routing
- Use a single locale context provided at the page level
- Use URL query params (`?lang=vi`) or a client-side language switcher backed by `localStorage` + React context
- Generate separate static pages via `generateStaticParams` if path-based locale is truly required (e.g., `/vi/blog/[slug]`)
- Update the existing `layout.tsx` hreflang `alternates.languages` to point to real paths that will be generated, or remove them until implemented

**Detection:** Attempt `npm run build` with any middleware-using i18n library. The build will fail or warn about middleware incompatibility with static export.

**Phase:** i18n implementation phase. Must be the first decision made before writing any translation strings.

---

### Pitfall C-3: GLTF Model Asset Not Found in GitHub Pages Static Export

**What goes wrong:** The `.glb` robot model file placed in `public/` resolves correctly in `npm run dev` (`/robot.glb`) but returns 404 in GitHub Pages production because GitHub Pages serves the site from a sub-path (e.g., `https://rayquasar18.github.io/`) and the `basePath` and `assetPrefix` are injected at build time via `NEXT_PUBLIC_BASE_PATH`.

**Why it happens:** The existing codebase already has this exact bug for `ButtonDownloadCV` (documented in `CONCERNS.md`): the CV download link is hardcoded as `/HaMinhQuan_CV.pdf` and ignores `NEXT_PUBLIC_BASE_PATH`. The R3F model loader (`useGLTF` from `@react-three/drei` or `GLTFLoader` directly) uses a plain string URL that will have the same problem if written naively as `useGLTF('/robot.glb')`.

**Consequences:** The robot model fails to load silently in production (no visible error to the user), the 3D canvas renders an empty scene, and the centerpiece feature is broken for all production visitors.

**Prevention:**
```tsx
// WRONG
useGLTF('/robot.glb')

// CORRECT — matches BaseImage/BaseVideo pattern already established
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
useGLTF(`${basePath}/robot.glb`)
```
Create a `useModelPath(path: string)` hook that applies the base path, mirroring the `BaseImage`/`BaseVideo` pattern already in the codebase. Apply this hook to every `useGLTF` / `useTexture` / external asset call in the 3D component.

**Detection:** Deploy to GitHub Pages and open browser DevTools Network tab — look for 404 on `.glb` and `.bin` assets.

**Phase:** 3D robot phase — validate in production deploy as a blocking acceptance criterion.

---

### Pitfall C-4: GLTF Animation Mixer Memory Leak on Component Unmount

**What goes wrong:** Three.js `AnimationMixer` and WebGL resources (geometry buffers, textures, materials) are not automatically garbage collected when a React component unmounts. If the 3D robot component is unmounted and remounted (e.g., on navigation to a blog page and back, or via React Strict Mode's double-mount in development), the old animation mixer and WebGL objects remain in memory, causing progressively increasing GPU memory usage and potential crashes on mobile.

**Why it happens:** R3F handles the render loop, but resource cleanup is the developer's responsibility. GLTF files contain geometry and textures that are registered on the WebGL context. Animation mixers hold references to action clips. None of these clean up automatically on React component unmount.

**Consequences:** Memory leak on mobile browsers. Potential GPU context loss ("WebGL context lost" error) after several page navigations. Especially problematic because the robot is the centerpiece — it's always visible.

**Prevention:**
```tsx
// In the robot component's cleanup
useEffect(() => {
  return () => {
    // Dispose geometry and materials from the GLTF scene
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    // Stop and uncache the mixer
    mixer?.stopAllAction()
    mixer?.uncacheRoot(gltf.scene)
  }
}, [gltf, mixer])
```
Use `useGLTF.preload('/robot.glb')` to cache the model at app start, avoiding re-fetch on remount. Use `drei`'s `useAnimations` hook which handles mixer lifecycle automatically.

**Detection:** Open Chrome DevTools Memory tab → take heap snapshot → navigate away and back → take another snapshot → compare retained GPU memory.

**Phase:** 3D robot phase — add cleanup code before the phase is considered done.

---

### Pitfall C-5: Chatbot Input Breaks Scroll Behavior and Mobile Viewport

**What goes wrong:** A sticky bottom chat input bar creates a persistent element at the bottom of the viewport. On mobile browsers (iOS Safari, Android Chrome), the virtual keyboard pushes the viewport up when focused, causing the sticky element to appear above the keyboard instead of at the true bottom. Additionally, the fixed/sticky chat bar overlaps page content — particularly the footer and the last section — without proper `padding-bottom` compensation on the page layout.

**Why it happens:** The existing codebase uses `h-[1100vh]` hardcoded scroll height and brittle pixel math for scroll animations (flagged in `CONCERNS.md`). A sticky overlay at the bottom will interact with these scroll calculations unexpectedly.

**Consequences:** On iOS, the chat bar hides behind the keyboard. Footer content is obscured. On desktop, the chat bar covers the last ~64px of every section during scroll. The robot animation offsets that depend on scroll position will be wrong because the viewport effective height changes when the keyboard opens.

**Prevention:**
- Use CSS `env(safe-area-inset-bottom)` for the sticky bar bottom offset on iOS
- Use `dvh` (dynamic viewport height) instead of `vh` for full-height sections: `h-[110dvh]` instead of `h-[1100vh]`
- Add `pb-[chatbar-height]` to the main page container whenever the chatbar is visible
- Test on an actual iOS device, not just Chrome DevTools mobile emulator (they behave differently with virtual keyboard)
- Use `window.visualViewport` resize events to reposition the chat bar when the keyboard opens

**Detection:** Open on iPhone Safari, tap the chat input, observe whether the send button is accessible above the keyboard.

**Phase:** Chatbot implementation phase — must test on real mobile device before completing the phase.

---

## Moderate Pitfalls

Mistakes that cause degraded experience or significant rework, but not total failure.

---

### Pitfall M-1: LLM Emotion Response Not Validated — Robot Stuck in Wrong Animation

**What goes wrong:** The LLM backend returns `{ answer: string, emotion: string }`. If the `emotion` field contains an unexpected value (a hallucinated emotion name, empty string, null, or a value not matching any animation clip name in the GLTF file), the robot either plays nothing or throws a runtime error. Since the portfolio IS the resume, a frozen or errored robot on load makes the first impression catastrophic.

**Why it happens:** LLMs occasionally return values outside their prompted constraints. The connection between backend emotion strings and GLTF animation clip names is implicit — a mismatch is undetectable until runtime.

**Prevention:**
```typescript
// Define the canonical emotion set as a type
type RobotEmotion = 'idle' | 'happy' | 'thinking' | 'excited' | 'sad'
const VALID_EMOTIONS = new Set<RobotEmotion>(['idle', 'happy', 'thinking', 'excited', 'sad'])

function parseEmotion(raw: string): RobotEmotion {
  const normalized = raw.toLowerCase().trim() as RobotEmotion
  return VALID_EMOTIONS.has(normalized) ? normalized : 'idle'
}
```
- Define the exact animation clip names that exist in the `.glb` file as a TypeScript enum
- Validate and normalize the `emotion` string from the API response before passing it to the animation controller
- Default to `'idle'` animation for any unknown value — never let the animation system receive an unrecognized action name

**Detection:** Mock the API to return `{ answer: "test", emotion: "INVALID_VALUE" }` — the robot should gracefully fall back to idle.

**Phase:** Chatbot + robot integration phase.

---

### Pitfall M-2: Blog i18n Conflicts — Untranslated Content Falls Through to Wrong Language

**What goes wrong:** With both Vietnamese and English blog posts from `.md` files, the routing and content-matching logic can serve an English-language blog post to a Vietnamese-language visitor (or vice versa) if the locale resolution is not strict. This is especially common when a post only exists in one language — the fallback behavior must be intentional.

**Why it happens:** Static blog generation (`generateStaticParams`) must enumerate all locale + slug combinations. If a post only has a Vietnamese version, the English route for that slug either 404s or silently falls back to the Vietnamese content with the wrong locale context (broken UI strings).

**Prevention:**
- Keep blog content in a directory structure that makes the locale explicit: `content/blog/en/[slug].md` and `content/blog/vi/[slug].md`
- In `generateStaticParams`, only generate a route if the post file exists for that locale
- Show a "Post not available in English" page with a link to the Vietnamese version rather than a 404 or silent fallback
- Never mix translated UI strings (from i18n messages) with untranslated markdown content in the same component without making the distinction explicit in types

**Detection:** Write a post only in Vietnamese. Try to access the English URL for that post — what happens?

**Phase:** Blog implementation phase.

---

### Pitfall M-3: Bundle Size Explosion from Three.js / R3F

**What goes wrong:** `three` is a large library (~600KB min+gzip). `@react-three/fiber` and `@react-three/drei` add more. If imported naively (even with `ssr: false`), they inflate the initial JavaScript bundle that blocks page interactivity, causing the Lighthouse Performance score — already at risk from the existing eager-loaded videos — to drop significantly.

**Why it happens:** Next.js code-splitting works per route. Since the whole portfolio is one route (`/`), everything lands in the same bundle unless explicitly split with `dynamic`. Even `dynamic({ ssr: false })` still loads the Three.js chunk on initial page load if not structured correctly.

**Consequences:** Poor Lighthouse score on a portfolio site that is itself the resume. Recruiters on mobile will see a slow-loading page.

**Prevention:**
- Use `dynamic` import with a loading placeholder that matches the space the robot will occupy — the Three.js bundle only loads after the initial HTML/CSS paints
- Configure `drei`'s tree-shaking: import only what you use (`import { useGLTF } from '@react-three/drei'`, not the entire lib)
- Use `@react-three/drei`'s `Preload` component to fetch the model in the background after initial render
- Set performance budgets: Three.js chunk should not exceed 200KB gzipped in the initial page load
- Verify with `next build` output — check the route's First Load JS size shown in the build summary

**Detection:** Run `npm run build` and inspect the "First Load JS" column in the output. Run Lighthouse on the deployed site.

**Phase:** 3D robot phase. Set up bundle analysis with `@next/bundle-analyzer` at the start.

---

### Pitfall M-4: Scroll Animation Magic Numbers Break When New Sections Are Added

**What goes wrong:** The existing `HeroSection.tsx` uses hardcoded scroll progress offsets (`0.07`, `0.02`, `0.15`) and a `h-[1100vh]` total section height. Adding a sticky chatbar, a blog section, or the About section (currently a stub) changes the scroll geometry, breaking all existing scroll-triggered animations.

**Why it happens:** Already documented in `CONCERNS.md` as a fragile area. The robot's idle/reaction animations will also need to be tied to scroll position (e.g., "look at the user" when the user reaches the hero section). If the robot animation is wired to the same brittle scroll offsets, it will be doubly fragile.

**Prevention:**
- Before adding any new sections, refactor `HeroSection.tsx` to use `useRef`-measured section height instead of `h-[1100vh]`
- Replace the `95` pixel header magic number with a measured `useRef` on the header element
- Named scroll regions: define `HERO_SCROLL_RANGE = { start: 0, end: 0.3 }` constants instead of inline floats
- Robot animations tied to scroll should reference the hero section's scroll range by reading its `offsetTop` / `offsetHeight`, not hardcoded values

**Detection:** Add a new section above the HeroSection and observe whether existing animations still trigger at the right scroll positions.

**Phase:** Must be addressed in the phase immediately before adding new sections (likely an early refactor phase).

---

### Pitfall M-5: MDX / Markdown Processing Inflates Build Time and Adds Complexity

**What goes wrong:** Adding MDX for the blog brings a new content processing pipeline (remark/rehype plugins for TOC generation, syntax highlighting, frontmatter parsing) that conflicts with Next.js App Router's expectations for how content is loaded. The most common mistake is using `next-mdx-remote` in Server Components without properly handling the async/await boundary, or using `@next/mdx` which requires custom webpack config that conflicts with Turbopack (the current dev server).

**Why it happens:** The project uses Turbopack for dev (`next dev --turbopack`). Turbopack has limited support for custom webpack loader configurations. MDX processing plugins (especially `rehype-pretty-code` for syntax highlighting) often require webpack-level loaders that simply don't work with Turbopack in 2025-2026.

**Consequences:** Blog posts fail to build, or Turbopack dev server breaks requiring a fallback to `next dev` (without `--turbopack`), or syntax highlighting doesn't work in development but works in production (very confusing debugging experience).

**Prevention:**
- Use `next-mdx-remote` rather than `@next/mdx` — it processes MDX at the page level without webpack config changes, making it Turbopack-compatible
- Do all MDX processing in Server Components / `generateStaticParams` — keep the React client boundary well below the content processing
- Test syntax highlighting (`rehype-pretty-code` or `shiki`) explicitly with Turbopack in dev mode before committing to it
- If Turbopack proves incompatible with a required rehype plugin, add `--turbopack` only conditionally: `"dev": "next dev"` (drop Turbopack) while tracking the plugin's compatibility status

**Detection:** Add a test `.md` file with a code block and run `npm run dev`. Check whether syntax highlighting renders correctly in development.

**Phase:** Blog implementation phase — resolve Turbopack compatibility before writing any blog content.

---

### Pitfall M-6: Chatbot API CORS Failure in Production (Static Site + External LLM Backend)

**What goes wrong:** The LLM backend API (`test/api/v1/...`) is a separate server. The portfolio is deployed on GitHub Pages (a different origin). When the chatbot's JavaScript sends a `fetch()` to the LLM backend from the user's browser, the browser enforces CORS. If the LLM backend does not return the correct `Access-Control-Allow-Origin` header for the GitHub Pages domain, every chatbot request will be blocked by the browser with a CORS error — not a network error, so no helpful message is shown to the user.

**Why it happens:** Portfolio is a fully static frontend at `https://rayquasar18.github.io`. There is no Next.js API route (`/api/*`) to proxy requests through — `output: 'export'` disables API routes entirely. All LLM API calls go directly from the browser to the backend.

**Consequences:** The chatbot appears to "not respond" to the user. No error is visible in the UI because `fetch()` rejects with a generic network error, not a CORS-specific message. This is a silent production failure.

**Prevention:**
- **Backend requirement:** The LLM backend MUST return `Access-Control-Allow-Origin: https://rayquasar18.github.io` (or `*` for public APIs) — coordinate this with the backend provider before integration
- **Defensive frontend:** Wrap all chatbot fetch calls in try/catch and display a user-friendly "Could not connect to assistant" message for any network-level failure
- **Local development:** Use a proxy in `next.config.ts`'s `rewrites` for dev-only CORS bypass (rewrites work in dev server even with `output: 'export'`)
- **Fallback mode:** Implement a mock response mode that activates when the API is unreachable, keeping the robot animated with canned responses instead of a broken empty state

**Detection:** Deploy to GitHub Pages, open DevTools Network tab, send a chat message, look for CORS errors in both the Console and Network tabs.

**Phase:** Chatbot implementation phase — verify CORS headers with the backend provider before writing the integration code.

---

## Minor Pitfalls

Mistakes that are annoying and time-consuming to fix but don't break core functionality.

---

### Pitfall N-1: OG Image and SEO Metadata Broken for Blog Posts

**What goes wrong:** The existing `layout.tsx` has a single hardcoded `share_img.png` for all OG/Twitter card metadata. Blog posts need their own OG images. Next.js App Router supports `generateMetadata()` per page, but each blog post's OG image URL must include the base path and be an absolute URL — otherwise social media crawlers (LinkedIn, Twitter) fail to display the preview card.

**Prevention:**
- Each blog post page should export `generateMetadata()` returning absolute image URLs
- OG image URL pattern: `${siteUrl}${basePath}/blog/og/${slug}.png` — generate fallback OG images programmatically using `@vercel/og` or pre-generate per-post images at build time
- Test OG tags with [opengraph.xyz](https://www.opengraph.xyz) before launch

**Phase:** Blog implementation phase.

---

### Pitfall N-2: Language Switcher Flashes Wrong Language on Page Load

**What goes wrong:** If the active language is stored in `localStorage` (client-side only), there will be a flash of the default language (likely Vietnamese) before the JavaScript loads and reads `localStorage` to apply English. For a portfolio visited by recruiters, seeing the wrong language for 200ms before correction looks unprofessional.

**Prevention:**
- Use a cookie for language preference instead of `localStorage` — cookies are sent with the initial HTTP request, allowing the server/build to render the correct language
- In static export, use an inline `<script>` in `layout.tsx` that reads `localStorage` synchronously and sets a `data-lang` attribute on `<html>` before React hydrates — similar to the "dark mode flash prevention" pattern

**Phase:** i18n implementation phase.

---

### Pitfall N-3: Three.js WebGL Context Limit on iOS Safari

**What goes wrong:** iOS Safari limits the number of simultaneous WebGL contexts per browser tab to 8 (and per page to fewer in practice). If the 3D robot's Canvas component is unmounted and remounted multiple times without proper disposal, each mount creates a new WebGL context. After hitting the limit, new canvases silently fail to render.

**Prevention:**
- Keep the robot's `<Canvas>` mounted persistently at the page level rather than mounting/unmounting it as the user scrolls
- Use visibility/opacity to hide the canvas instead of conditional rendering: `<div className={isVisible ? 'opacity-100' : 'opacity-0'}>`
- Never create more than one R3F Canvas on the page simultaneously

**Phase:** 3D robot phase.

---

### Pitfall N-4: `"use client"` Boundary Fragility — Existing Bug Will Compound

**What goes wrong:** The codebase audit in `CONCERNS.md` flagged that `IntroduceSection` and `ProjectSection` are missing `"use client"` directives and only work because `page.tsx` has it. Adding 3D components and chatbot (both inherently client-only) will push more components toward requiring client context. As new routes are added (blog post pages), `page.tsx` for those routes will NOT have `"use client"`, and the existing fragile pattern will break.

**Prevention:**
- Fix the missing `"use client"` directives in `IntroduceSection` and `ProjectSection` in the first development phase, before adding new features
- Establish a rule: every component that uses hooks (`useState`, `useRef`, `useEffect`, motion hooks) must declare `"use client"` explicitly, regardless of what the parent page does
- This is a first-phase hygiene task, not a separate pitfall to solve later

**Phase:** Phase 1 (codebase cleanup) — must be done before any new features are added.

---

### Pitfall N-5: Blog Search with Static Export — Client-Side Only, No Server Index

**What goes wrong:** Blog search must be entirely client-side because there is no server. The naive implementation downloads all blog post metadata on every page load for search to work, which becomes slow as the blog grows. The alternative (a search service like Algolia) adds a third-party dependency and cost.

**Prevention:**
- Use `fuse.js` (fuzzy search, ~24KB) with a pre-built search index generated at build time
- Generate `public/search-index.json` during the Next.js build by reading all markdown files and indexing their title, tags, and excerpt
- The client downloads the index once and searches in-memory — acceptable for a personal blog with <100 posts
- Never search the full post body client-side; index only metadata fields

**Phase:** Blog implementation phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| 3D robot integration | C-1: SSR crash on build | `dynamic({ ssr: false })` wrapper — first task of the phase |
| 3D robot integration | C-3: GLTF 404 on GitHub Pages | Apply `NEXT_PUBLIC_BASE_PATH` via a `useModelPath()` hook |
| 3D robot integration | C-4: Memory leak on unmount | Use `useAnimations` from drei; dispose geometry on cleanup |
| 3D robot integration | M-3: Bundle size explosion | `@next/bundle-analyzer` audit; dynamic import structure |
| 3D robot integration | N-3: iOS WebGL context limit | Keep Canvas mounted, use opacity toggle not conditional render |
| Chatbot integration | C-5: Mobile sticky bar keyboard overlap | Use `dvh` units, `safe-area-inset`, real iOS device testing |
| Chatbot integration | M-1: Invalid emotion crashes animation | Validate/normalize emotion string before animating |
| Chatbot integration | M-6: CORS failure on GitHub Pages | Coordinate CORS headers with backend before writing fetch code |
| i18n implementation | C-2: Middleware incompatible with static export | Use next-intl "without routing" mode; no middleware |
| i18n implementation | N-2: Language flash on load | Cookie-based locale or inline script to set `data-lang` before hydration |
| Blog implementation | M-2: Untranslated posts fallback wrong | Directory-per-locale structure; explicit missing-translation page |
| Blog implementation | M-5: MDX/Turbopack incompatibility | Test rehype plugins with Turbopack in dev before committing |
| Blog implementation | N-1: OG images broken for posts | `generateMetadata()` with absolute URLs per post |
| Blog implementation | N-5: Client-side search bloat | Pre-built `search-index.json` at build time; `fuse.js` |
| All phases | N-4: Missing "use client" compounds | Fix existing violations in Phase 1 before adding any features |
| All phases | M-4: Scroll magic numbers break | Refactor HeroSection scroll math before adding new sections |
| All phases | C-2 (existing): hreflang 404s | Remove or implement `/vi` and `/en` alternates from `layout.tsx` |

---

## Pre-existing Bugs to Fix Before Adding Features

These are documented in `.planning/codebase/CONCERNS.md` and will compound new feature bugs if not resolved first:

| Bug | File | Risk if Not Fixed |
|-----|------|-------------------|
| Missing `"use client"` on `IntroduceSection`, `ProjectSection` | `src/components/sections/` | Breaks silently when any new route lacks `"use client"` on page.tsx |
| `ButtonDownloadCV` ignores `NEXT_PUBLIC_BASE_PATH` | `src/components/ButtonDownloadCV.tsx` | CV download breaks in production — same pattern will be repeated for robot model URL |
| `metadata.title.template` misconfigured | `src/app/layout.tsx` | Blog post pages will show wrong titles in browser tabs and search results |
| hreflang `/vi` and `/en` routes don't exist | `src/app/layout.tsx` | SEO penalty; 404s on declared alternate URLs |
| `LoadingScreen` dual-trigger + no real asset-readiness signal | `src/components/LoadingScreen.tsx` | When 3D model takes time to load, loading screen dismisses before robot is ready |
| Scroll magic numbers tied to `h-[1100vh]` | `src/components/sections/HeroSection.tsx` | Any new section or sticky chatbar breaks all scroll animations |

---

## Sources

- `.planning/codebase/CONCERNS.md` — Codebase audit (2026-03-13): existing bugs, fragile areas, performance bottlenecks
- `.planning/codebase/ARCHITECTURE.md` — Architecture analysis: static export, single-route SPA, no server
- `.planning/codebase/STACK.md` — Technology stack: Next.js 15.3.1, React 19, static export, GitHub Pages
- `.planning/codebase/INTEGRATIONS.md` — External integration audit: GitHub Pages deployment, CORS context
- `.planning/PROJECT.md` — Project requirements: robot + chatbot architecture, i18n scope, blog requirements
- Domain knowledge: React Three Fiber SSR behavior, Three.js WebGL context management, Next.js static export constraints, LLM API integration patterns, markdown blog architecture (MEDIUM confidence — training data, verified against codebase context)
