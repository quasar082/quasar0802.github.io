# Architecture Patterns

**Domain:** AI Engineer Portfolio — Next.js + 3D WebGL + Chatbot + Markdown Blog + i18n
**Researched:** 2026-03-13
**Overall Confidence:** HIGH (core patterns from well-established libraries; static export i18n constraint from official Next.js docs)

---

## Critical Constraint: Static Export

The existing project uses `output: 'export'` in `next.config.ts` and deploys to GitHub Pages as a static artifact. This constraint shapes every architectural decision below:

- **Middleware does NOT run in static export.** The standard Next.js i18n routing pattern (middleware + `app/[lang]/`) requires a running server. For static export, locale must be detected and managed client-side or via URL convention with `generateStaticParams`.
- **API routes do NOT work in static export.** The chatbot endpoint must be an external service. The Next.js route handler at `app/api/chat/route.ts` cannot be used unless you add a separate server deployment (e.g., Vercel Functions, Cloudflare Workers) as a companion API.
- **No SSR, no RSC data-fetching.** Blog posts must be read from the filesystem at build time and baked into static props or imported directly as modules.

---

## Recommended Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Browser                                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  React DOM Tree (Next.js App Router)                            │ │
│  │                                                                 │ │
│  │  app/[lang]/layout.tsx ─── IntlProvider ─── ThemeProvider      │ │
│  │       │                                                         │ │
│  │  app/[lang]/page.tsx ─ HeroSection ─ IntroduceSection          │ │
│  │                          │             AboutSection             │ │
│  │                          │             ProjectSection           │ │
│  │                          │             BlogSection              │ │
│  │                          │                                      │ │
│  │                     ┌────┴────────────────────────────────┐     │ │
│  │                     │  R3F Canvas (isolated renderer)     │     │ │
│  │                     │  ┌──────────────────────────────┐   │     │ │
│  │                     │  │  RobotScene                  │   │     │ │
│  │                     │  │    ├── RobotModel (GLTF)     │   │     │ │
│  │                     │  │    ├── EmotionController     │   │     │ │
│  │                     │  │    ├── Lighting              │   │     │ │
│  │                     │  │    └── Environment           │   │     │ │
│  │                     │  └──────────────────────────────┘   │     │ │
│  │                     └─────────────────────────────────────┘     │ │
│  │                                                                 │ │
│  │  ChatWidget (sticky, portal-mounted in layout)                  │ │
│  │       │                                                         │ │
│  │       └── useChatStore (Zustand) ─────────── useRobotStore      │ │
│  │                                              (Zustand, shared   │ │
│  │                                               with R3F Canvas)  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  External LLM API  ◄──── fetch() from ChatWidget                    │
│  (test/api/v1/...)                                                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### Layer 1: Routing / Shell

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `app/[lang]/layout.tsx` | HTML shell, font loading, SEO metadata, persistent chrome, IntlProvider, ChatWidget portal | All children, `next-intl` |
| `app/[lang]/page.tsx` | Composes ordered scroll sections for home | Section components |
| `app/[lang]/blog/page.tsx` | Blog index — list + search + tag filter | Blog data layer, i18n |
| `app/[lang]/blog/[slug]/page.tsx` | Blog post detail — MDX render, TOC, code highlight | MDX processor, i18n |
| `app/[lang]/projects/[slug]/page.tsx` | Project detail page | Project data layer, i18n |

### Layer 2: Section Components

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `HeroSection` | Black hole bg image, 3D robot Canvas, scroll-driven transforms | `RobotCanvas`, `useRobotStore` |
| `IntroduceSection` | Storytelling narrative, images, animated text | Shared UI, i18n |
| `AboutSection` | Skills, experience cards | Shared UI, i18n |
| `ProjectSection` | Project card grid, links to detail pages | Project data layer, i18n |
| `BlogSection` | Recent posts preview, link to `/blog` | Blog data layer, i18n |

### Layer 3: 3D Subsystem (R3F)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `RobotCanvas` | R3F `<Canvas>` host, suspense boundary, camera, postprocessing | `HeroSection` (mounts it), `useRobotStore` |
| `RobotScene` | Three.js scene graph — lights, environment, robot | `RobotModel`, `EmotionController` |
| `RobotModel` | GLTF loader, animation mixer, bone access | `useRobotStore` (reads `emotion`) |
| `EmotionController` | Maps emotion string → animation clip name → mixer action | `RobotModel`, `useRobotStore` |
| `useRobotStore` | Zustand store — `emotion`, `isTalking`, `isIdle` | `RobotModel`, `ChatWidget` |

**Key isolation rule:** R3F Canvas runs a separate React renderer. No hooks from outside the Canvas can be called inside it, and vice versa. State that must cross this boundary — specifically the `emotion` value from the chatbot — must live in a Zustand store (or a React ref) that both sides read independently.

### Layer 4: Chatbot Subsystem

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `ChatWidget` | Sticky bottom chat UI, input bar, message thread, open/close toggle | `useChatStore`, `useRobotStore` |
| `ChatMessage` | Single message bubble (user or bot) with timestamp | `ChatWidget` |
| `ChatInput` | Text input + send button, keyboard handling | `ChatWidget` |
| `useChatStore` | Zustand store — messages array, loading state, error state | `ChatWidget`, `chatApi` |
| `chatApi` | `fetch()` wrapper for external LLM endpoint, typed request/response | `useChatStore` |

### Layer 5: Blog Data Layer

| Module | Responsibility | Communicates With |
|--------|---------------|-------------------|
| `lib/blog.ts` | Build-time: reads `content/blog/*.md`, parses frontmatter with `gray-matter`, returns typed `Post[]` | Blog pages, `generateStaticParams` |
| `lib/mdx.ts` | Compiles MDX/MD content to renderable output via `next-mdx-remote` or `mdx-bundler` | Blog post page |
| `content/blog/*.md` | Source of truth for all blog posts | `lib/blog.ts` |

### Layer 6: i18n Layer

| Module | Responsibility | Communicates With |
|--------|---------------|-------------------|
| `messages/en.json` | English translation dictionary | `next-intl` |
| `messages/vi.json` | Vietnamese translation dictionary | `next-intl` |
| `i18n/request.ts` | Configures `next-intl` locale from URL param | `app/[lang]/layout.tsx` |
| `middleware.ts` | NOT USED — static export. Locale detection is via URL `[lang]` segment only | — |

### Layer 7: Shared UI Components

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `AnimatedDiv` / `AnimatedText` | Scroll-in-view reveal wrappers (existing, keep) | Framer Motion |
| `BaseImage` / `BaseVideo` | Base-path-aware media (existing, keep) | Next.js Image |
| `Header` | Fixed nav with language switcher, active section tracking | i18n, scroll state |
| `Footer` | Social links, copyright | i18n |
| `LoadingScreen` | Asset-load gate (existing, keep) | window load event |
| `Tag` | Blog post tag chip, filterable | Blog pages |
| `TOC` | Table of contents from markdown headings | Blog post page |
| `CodeBlock` | Syntax-highlighted code with copy button | MDX renderer |

---

## Data Flow

### Chatbot → Robot Emotion Flow

```
User types message
        │
        ▼
ChatWidget.handleSend()
        │
        ▼
chatApi.sendMessage(text)  ──── POST ────►  External LLM API
        │                                   { answer: string, emotion: string }
        │ ◄─────────────────────────────────
        ▼
useChatStore.addMessage(answer)
        │
        ▼
useRobotStore.setEmotion(emotion)   ← this crosses the Canvas boundary via Zustand
        │
        ▼
RobotModel (inside R3F Canvas)
  reads useRobotStore.emotion
        │
        ▼
EmotionController maps emotion → animation clip
        │
        ▼
Three.js AnimationMixer plays clip
```

**Why Zustand crosses the Canvas boundary:** R3F's `<Canvas>` creates its own React root internally. A plain React `Context.Provider` outside the Canvas is NOT accessible inside it. Zustand's store lives outside React's tree entirely (in a JS module closure), so both DOM components and R3F scene components can subscribe to it directly. This is the standard, recommended pattern for R3F+DOM state sharing.

### i18n Data Flow (Static Export)

```
User visits /vi  or  /en
        │
        ▼
Next.js static file served (app/[lang]/page.tsx pre-built for each locale)
        │
        ▼
app/[lang]/layout.tsx
  reads params.lang
  loads messages/[lang].json
  wraps children in <NextIntlClientProvider messages={...}>
        │
        ▼
All components call useTranslations('namespace')
        │
        ▼
Language switcher in Header
  calls router.push('/[otherLang]' + currentPath)
```

**Static params generation:**
```typescript
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }]
}
```

This generates `/en/index.html` and `/vi/index.html` at build time.

**Root redirect:** `app/page.tsx` (root `/`) must redirect to `/en` as the default locale. Since there's no server, this is a client-side redirect via `useEffect(() => router.push('/en'))` or a static `index.html` with a meta-refresh.

### Blog Data Flow (Build-Time)

```
content/blog/*.md  (markdown files with frontmatter)
        │
        ▼  (at build time only)
lib/blog.ts
  gray-matter parses frontmatter → slug, title, date, tags, description
  returns Post[] sorted by date
        │
        ▼
app/[lang]/blog/page.tsx
  calls getBlogPosts() → gets Post[] (all posts, no locale filtering at this level)
  renders blog index with tag filter (client-side JS filter)
        │
        ▼
app/[lang]/blog/[slug]/page.tsx
  generateStaticParams() → all slugs × all locales
  calls getPostBySlug(slug)
  compiles MDX with next-mdx-remote
  renders with custom components (CodeBlock, TOC)
```

**Blog i18n approach:** Keep blog posts language-agnostic initially (English only). If Vietnamese posts are needed later, use `slug-vi.md` naming convention or frontmatter `lang` field. This avoids a complex dual-language content pipeline.

### Scroll Animation Flow (existing, preserved)

```
User scrolls
        │
        ▼
HeroSection useScroll + useTransform
        │
        ▼
motion.div style props (no setState, no re-renders)
```

This is preserved as-is. The 3D robot Canvas is placed inside the HeroSection and coexists with existing scroll animations.

---

## Suggested Build Order

Build order is determined by dependencies — what each piece needs to already exist.

```
Phase 1: Foundation restructure (i18n routing + design system baseline)
  └── Reason: Everything else sits inside app/[lang]/. Must exist before any page is built.
  └── Deliverables: app/[lang]/ routing, next-intl setup, messages/en.json + vi.json skeleton,
                    Header language switcher, dark theme CSS tokens

Phase 2: 3D Robot + Chatbot (the centerpiece)
  └── Reason: This is the core differentiator. Build it early while the codebase is clean.
              RobotCanvas + useRobotStore can be built even without the .glb file (placeholder geometry).
              ChatWidget + useChatStore + chatApi can be built against a mock endpoint.
  └── Deliverables: RobotCanvas, RobotScene, RobotModel (with fallback), EmotionController,
                    useRobotStore, ChatWidget, ChatInput, ChatMessage, useChatStore, chatApi

Phase 3: Hero section redesign
  └── Reason: Requires Phase 2's RobotCanvas. Integrates 3D robot into scroll-driven layout.
  └── Deliverables: HeroSection rebuilt with static black hole bg + RobotCanvas foreground

Phase 4: Content sections
  └── Reason: Sections don't depend on each other. Can build in any order after Phase 1.
              IntroduceSection, AboutSection, ProjectSection — all use i18n from Phase 1.
  └── Deliverables: Rebuilt IntroduceSection (storytelling), AboutSection (skills),
                    ProjectSection with detail pages, scroll animations

Phase 5: Blog system
  └── Reason: Blog is isolated from everything above. The data layer (gray-matter) is
              independent. Can be developed last without blocking other features.
  └── Deliverables: lib/blog.ts, content/blog/*.md structure, blog index page,
                    blog post page, TOC, CodeBlock, tag filter

Phase 6: SEO + polish
  └── Reason: SEO requires final page content and structure. Polish requires all features complete.
  └── Deliverables: OG images per page, JSON-LD per post/project, sitemap with blog routes,
                    perf optimization (lazy R3F, image optimization, bundle analysis)
```

---

## Key Architectural Decisions

### Decision 1: Zustand for Robot-Chat State Bridge

**Context:** R3F Canvas is an isolated renderer. The emotion value from the chatbot API must reach the robot inside the Canvas.

**Decision:** Use `useRobotStore` (Zustand) as the bridge. ChatWidget writes `emotion`, RobotModel reads it. Neither component knows about the other.

**Alternative rejected:** React Context — does not cross R3F Canvas boundary. Refs — would require imperative `setEmotion(ref)` calls, coupling the components.

### Decision 2: App Router with `[lang]` Segment for i18n (No Middleware)

**Context:** Static export cannot run middleware. The standard Next.js i18n approach requires middleware for automatic redirect.

**Decision:** Use `app/[lang]/` folder structure with `generateStaticParams` to pre-build `/en/` and `/vi/` at build time. Language detection at runtime is a client-side redirect from `/` to `/en`.

**Alternative rejected:** `next-i18n-router` — requires middleware. URL hash locale (`/?lang=vi`) — breaks SEO and direct sharing. Cookie-based locale — doesn't work without a server.

**Confidence:** HIGH — this is documented in the official Next.js static rendering + i18n guide.

### Decision 3: `next-intl` for Translation Management

**Context:** Need a typed, ergonomic i18n solution compatible with static export.

**Decision:** Use `next-intl` with `NextIntlClientProvider` wrapping client components. Translation files are JSON in `messages/`. The `getDictionary` function loads messages at the layout level.

**Alternative rejected:** `react-i18next` — heavier, requires separate setup, `next-intl` is more Next.js-native. Manual `t()` functions — no type safety.

**Confidence:** MEDIUM — `next-intl` static export support confirmed in their docs as of 2024, but verify the specific static export config during implementation.

### Decision 4: `gray-matter` + `next-mdx-remote` for Blog

**Context:** Blog posts are `.md` files in the repo. Need frontmatter parsing, MDX support for custom components (code blocks), no CMS.

**Decision:** `gray-matter` for frontmatter parsing at build time. `next-mdx-remote/rsc` for server-side MDX compilation in the blog post page.

**Alternative rejected:** `contentlayer` — unmaintained as of 2024 (project archived). `mdx-bundler` — more complex setup, better for dynamic imports which aren't needed here. `@next/mdx` — less flexible for custom components and dynamic slug routing.

**Confidence:** MEDIUM — `next-mdx-remote` is actively maintained and widely used. The `/rsc` import is the App Router pattern. Verify version compatibility with Next.js 15 / React 19 during implementation.

### Decision 5: External API for Chatbot (Not Next.js API Route)

**Context:** Static export cannot serve API routes. The LLM backend is external (`test/api/v1/...`).

**Decision:** `chatApi.ts` is a pure `fetch()` wrapper that calls the external endpoint directly from the browser. No Next.js API route proxy is needed.

**Implication:** CORS must be configured on the LLM backend to allow requests from `https://rayquasar18.github.io`. Flag this as an integration dependency.

**Alternative considered:** Deploy a separate Vercel/Cloudflare Worker as API proxy. Not needed unless CORS becomes a problem or the LLM API key must be hidden from the client.

### Decision 6: R3F Canvas as `position: absolute` Overlay in HeroSection

**Context:** Hero section has a static background image (black hole). The robot should appear to float in the foreground.

**Decision:** `RobotCanvas` renders with `position: absolute; inset: 0; z-index: 10` inside the Hero container. The background image sits below it in normal document flow. The canvas `gl.alpha = true` ensures transparency so the background shows through.

**Alternative rejected:** Full-page fixed canvas — would require complex z-index management with all page sections. Per-section canvas is simpler and scoped.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: React Context to Share Robot Emotion

**What goes wrong:** You create a `RobotContext.Provider` in `HeroSection` and try to `useContext(RobotContext)` inside the R3F Canvas. It returns `undefined`.

**Why it breaks:** R3F's `<Canvas>` creates a separate React root via `ReactDOM.createRoot`. Context providers from outside the canvas root are not accessible inside it.

**Instead:** Use Zustand. Both DOM and R3F components subscribe directly to the store.

### Anti-Pattern 2: Middleware-Based i18n with Static Export

**What goes wrong:** You configure `middleware.ts` with locale detection and redirect, add `output: 'export'`, and run `next build`. Build succeeds but locale detection never runs in production (middleware is a server concept).

**Why it breaks:** Static export generates pure HTML/CSS/JS. There's no server process to run middleware.

**Instead:** Use `app/[lang]/` with `generateStaticParams` and a client-side redirect from the root.

### Anti-Pattern 3: `contentlayer` for Blog

**What goes wrong:** You add `contentlayer2` or `contentlayer`, configure it, and it breaks with Next.js 15.

**Why it breaks:** The original `contentlayer` project was archived in 2024. Community forks exist (`contentlayer2`) but have uncertain maintenance. Type definitions lag behind Next.js versions.

**Instead:** Use `gray-matter` + `next-mdx-remote`. More code but fully under your control and no maintenance risk.

### Anti-Pattern 4: Loading the GLTF Model Without Preloading

**What goes wrong:** `RobotModel` calls `useGLTF('/robot.glb')` inside the Canvas, but the Canvas isn't rendered until the user scrolls to the hero. The model loads late, causing a visible pop-in.

**Why it breaks:** `useGLTF` only fetches when the component mounts. If the Canvas is lazy-loaded or the hero is below the fold, the robot appears with a delay.

**Instead:** Call `useGLTF.preload('/robot/robot.glb')` at the module level (outside the component) in `RobotCanvas.tsx`. This triggers the fetch immediately when the JS bundle loads, before the Canvas even mounts.

### Anti-Pattern 5: Putting All Animation Clips in a Single `useFrame` Loop

**What goes wrong:** You implement emotion-based animations by checking `emotion` in `useFrame` and manually interpolating bone transforms every frame. This creates complex, hard-to-maintain animation code.

**Instead:** Use Three.js `AnimationMixer` with named animation clips from the GLTF file. The `EmotionController` maps emotion strings to clip names and calls `mixer.clipAction(clip).play()`. The mixer handles interpolation, looping, and blending automatically.

---

## Scalability Considerations

| Concern | Current (single-page SPA) | After this milestone | Future |
|---------|--------------------------|---------------------|--------|
| Bundle size | Small — minimal deps | Grows with R3F (~300KB gz), mdx-remote | Split by route via App Router |
| 3D performance | N/A | One robot, static scene — fine on modern hardware | Use `@react-three/drei` PerformanceMonitor to downgrade quality on low-end devices |
| Blog post count | N/A | File system at build time — scales to hundreds of posts | Over ~500 posts, build time grows; add incremental generation |
| i18n content | N/A | Two locales, JSON dictionaries | Adding locales = adding one JSON file per locale |
| Chat API load | N/A | External API, zero server cost from portfolio side | Rate limiting on the LLM API side, not portfolio's concern |

---

## Directory Structure (Target)

```
src/
├── app/
│   ├── [lang]/                        # i18n root — all routes nested here
│   │   ├── layout.tsx                 # IntlProvider, ChatWidget portal, SEO
│   │   ├── page.tsx                   # Home page (sections)
│   │   ├── blog/
│   │   │   ├── page.tsx               # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Blog post detail
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx           # Project detail
│   ├── page.tsx                       # Root "/" → client redirect to /en
│   ├── globals.css
│   └── layout.tsx                     # Minimal root layout (no lang context here)
├── components/
│   ├── sections/                      # Page scroll sections
│   │   ├── HeroSection.tsx
│   │   ├── IntroduceSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectSection.tsx
│   │   └── BlogSection.tsx
│   ├── robot/                         # 3D subsystem — isolated
│   │   ├── RobotCanvas.tsx            # Canvas host + Suspense
│   │   ├── RobotScene.tsx             # Scene graph
│   │   ├── RobotModel.tsx             # GLTF + AnimationMixer
│   │   └── EmotionController.tsx      # Emotion → clip mapping
│   ├── chat/                          # Chatbot subsystem — isolated
│   │   ├── ChatWidget.tsx             # Sticky container
│   │   ├── ChatMessage.tsx            # Message bubble
│   │   └── ChatInput.tsx              # Input bar
│   ├── blog/                          # Blog-specific UI
│   │   ├── BlogCard.tsx
│   │   ├── Tag.tsx
│   │   ├── TOC.tsx
│   │   └── CodeBlock.tsx
│   └── ui/                            # Shared primitives (existing components here)
│       ├── AnimatedDiv.tsx
│       ├── AnimatedText.tsx
│       ├── BaseImage.tsx
│       ├── BaseVideo.tsx
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LoadingScreen.tsx
├── stores/                            # Zustand stores
│   ├── useRobotStore.ts               # emotion, isTalking, isIdle
│   └── useChatStore.ts                # messages, loading, error
├── lib/                               # Build-time + runtime utilities
│   ├── blog.ts                        # gray-matter post parsing
│   ├── mdx.ts                         # next-mdx-remote compilation
│   └── chatApi.ts                     # fetch() wrapper for LLM endpoint
├── i18n/
│   └── request.ts                     # next-intl locale config
└── types/
    ├── blog.ts                        # Post, FrontMatter types
    ├── chat.ts                        # Message, ChatResponse types
    └── robot.ts                       # Emotion union type

messages/
├── en.json                            # English translations
└── vi.json                            # Vietnamese translations

content/
└── blog/
    ├── my-first-post.md
    └── rag-pipeline-design.md

public/
├── robot/
│   └── robot.glb                      # 3D robot model (provided by owner)
└── hero/
    └── blackhole.jpg                  # Static hero background image
```

---

## Build Order Implications for Roadmap

The five phases above map to buildable milestones:

1. **Phase 1 (i18n Foundation)** must precede all others. Every page route changes from `app/page.tsx` to `app/[lang]/page.tsx`. This is a structural refactor with no visible user-facing change.

2. **Phase 2 (3D + Chat)** is independent of blog, can be built while blog is not started. But it requires Phase 1 routes to exist. The robot model `.glb` and the LLM API endpoint are both external dependencies — build with stubs.

3. **Phase 3 (Hero)** requires Phase 2's `RobotCanvas` and `useRobotStore`. Short phase.

4. **Phase 4 (Content Sections)** requires only Phase 1 (for i18n hooks). IntroduceSection, AboutSection, ProjectSection can all be built in parallel with Phase 2.

5. **Phase 5 (Blog)** requires Phase 1 routing (for `app/[lang]/blog/` structure). Completely independent of 3D and chat.

6. **Phase 6 (SEO + Polish)** requires all content to be complete.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| i18n with static export | HIGH | Official Next.js docs confirm `app/[lang]/` + `generateStaticParams` as the static export i18n pattern. `next-intl` docs confirm static export compatibility. |
| R3F Canvas isolation + Zustand bridge | HIGH | Well-documented R3F pattern; Context boundary limitation is a documented R3F behavior. Zustand as bridge is the canonical R3F community solution. |
| Blog with gray-matter + next-mdx-remote | MEDIUM | Both are actively maintained and compatible with Next.js 15 as of training data. Verify `next-mdx-remote` version compatibility with React 19 during implementation. |
| Chatbot fetch architecture | HIGH | Plain `fetch()` from client to external API — no framework magic involved. |
| Build order dependencies | HIGH | Derived from explicit code dependencies, not assumptions. |

---

## Sources

- Next.js Internationalization docs (official, fetched 2026-03-13): https://nextjs.org/docs/app/guides/internationalization
- R3F Canvas isolation — R3F documentation and community patterns (training data, HIGH confidence for Canvas boundary behavior)
- `next-intl` static export support — training data + next-intl.dev documentation pattern (MEDIUM, verify during implementation)
- `gray-matter` + `next-mdx-remote` — widely used Next.js blog stack, confirmed active maintenance (MEDIUM)
- Existing codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `package.json` (git HEAD)

---

*Architecture research: 2026-03-13*
