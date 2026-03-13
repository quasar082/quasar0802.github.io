# Phase 1: Codebase Cleanup - Research

**Researched:** 2026-03-13
**Domain:** Next.js 15 (App Router, static export), React 19, Framer Motion, client/server component architecture
**Confidence:** HIGH

## Summary

Phase 1 addresses four concrete bugs in the existing portfolio codebase: missing `"use client"` directives causing hydration errors, basePath/URL configuration pointing to an old domain, a flawed loading screen transition with race conditions, and hardcoded magic numbers in scroll-driven hero animations.

The codebase uses Next.js 15.3.1 with React 19, Framer Motion 12.7.4, and static export (`output: 'export'`). All source files exist in git history but are deleted from the working tree -- they must be restored before work begins. The fixes are straightforward refactoring tasks with no new dependencies required.

**Primary recommendation:** Restore source files from git first, then execute four independent fix tracks: (1) `"use client"` audit, (2) basePath/URL cleanup, (3) LoadingScreen rewrite, (4) HeroSection scroll constant extraction. Convert `page.tsx` to server component since it only composes client section components.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Loading-to-hero transition: wait for `document.readyState === 'complete'` + minimum 1.5s display time (whichever is later). Transition animation: scale down + fade out (not the current h-screen to h-0 which causes layout jumps). Keep current ldrs spinners (Bouncy + Reuleaux). Remove the race condition between setTimeout(1000) and window.load event.
- Scroll animation approach: Keep video-based hero with scroll-driven animations. Keep the quote zoom effect ("QUIET EFFORT CREATES LOUD IMPACT").
- BasePath strategy: Deploy to root domain (rayquasar18.github.io) -- no basePath needed. Remove `NEXT_PUBLIC_BASE_PATH` from both env files. Remove basePath/assetPrefix conditional logic from next.config.ts. CV download uses direct path: `/HaMinhQuan_CV.pdf`. Update all URL references from `quanmofii.github.io` to `rayquasar18.github.io`.
- Use client audit: Full audit of all components. Clear client/server separation for SEO and loading performance. Split components where beneficial. Convert page.tsx to server component. 4 known missing directives: GradientBackground, InfoItem, IntroduceSection, ProjectSection.

### Claude's Discretion
- Scroll lock behavior during loading screen (recommended: lock)
- Loading screen DOM removal after transition (recommended: remove from DOM)
- Hero animation coordination with loading screen dismiss (recommended: start after loading gone)
- Loading screen error/timeout behavior (recommended: timeout and dismiss)
- HeroSection scroll length (h-[1100vh]) -- adjust if needed
- Magic number approach in scroll transforms (95px, 40%, 1700%, 5200%) -- replace with computed/measured values or extract as named constants
- Quote zoom scale values -- make responsive across screen sizes

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDN-01 | Fix missing `"use client"` directives on components using React hooks | Full component audit completed -- 4 missing directives identified (GradientBackground, InfoItem, IntroduceSection, ProjectSection). page.tsx should be converted to server component. All components analyzed for hook/browser API usage. |
| FNDN-02 | Fix basePath bug for CV download and asset URLs in production | basePath strategy fully documented -- deploy to root domain, remove all NEXT_PUBLIC_BASE_PATH references, simplify next.config.ts, update all quanmofii.github.io URLs to rayquasar18.github.io. BaseVideo and BaseImage basePath logic to be removed. |
| FNDN-04 | Fix LoadingScreen timing and scroll magic numbers in HeroSection | LoadingScreen race condition analyzed -- current code has setTimeout(1000) racing with window.load event, plus h-screen to h-0 transition causing layout jump. Replacement pattern: readyState + min timer with scale+fade exit. HeroSection magic numbers catalogued: 95px, 40%, 1700%, 5200%, h-[1100vh], scale ranges [1,70,220]. |
| UX-05 | CV download button works correctly with proper basePath | ButtonDownloadCV already hardcodes `/HaMinhQuan_CV.pdf` -- works at root domain. Verify file exists in public/ directory. No code change needed for button itself, just ensure basePath removal does not break it. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.3.1 | Framework (App Router, static export) | Already installed, no change needed |
| react | ^19.0.0 | UI library | Already installed, React 19 with `use client` directive support |
| framer-motion | ^12.7.4 | Animation (scroll, transitions, presence) | Already installed, used throughout for all animations |
| ldrs | ^1.1.7 | Loading spinners (Bouncy, Reuleaux) | Already installed, used in LoadingScreen -- keep as-is per user decision |
| zustand | ^5.0.3 | State management | Already installed, not used in Phase 1 but present in deps |
| lucide-react | ^0.488.0 | Icons (Terminal, Download, ArrowRight, ArrowUpRight) | Already installed, used in multiple components |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | ^4 | Utility-first CSS | Already configured, all styling uses Tailwind |
| typescript | ^5 | Type safety | Already configured |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| N/A | N/A | No new libraries needed -- Phase 1 is cleanup only |

**Installation:**
No new installations needed. All dependencies already in package.json.

## Architecture Patterns

### Current Project Structure
```
src/
  app/
    page.tsx           # Main page (currently "use client" -- should be server component)
    layout.tsx         # Root layout (server component with metadata)
    globals.css        # Global styles (Tailwind v4 @import)
    fonts/             # Local fonts (MarlinGeoSQ, Saprona families)
  components/
    AnimatedDiv.tsx    # framer-motion wrapper (has "use client")
    AnimatedText.tsx   # Word-by-word animation (has "use client")
    BaseImage.tsx      # next/image wrapper with basePath (has "use client")
    BaseVideo.tsx      # Video element with basePath (has "use client")
    ButtonDownloadCV.tsx  # CV download button (has "use client")
    ButtonRedirect.tsx    # External link button (has "use client")
    Footer.tsx         # Fixed footer with contact info (has "use client")
    GradientBackground.tsx # Mouse-following gradient (MISSING "use client")
    Header.tsx         # Navigation header (has "use client")
    InfoItem.tsx       # Hover-reveal info item (MISSING "use client")
    LoadingScreen.tsx  # Loading screen (has "use client")
    sections/
      AboutSection.tsx      # Empty placeholder (has "use client")
      HeroSection.tsx       # Scroll-driven hero (has "use client")
      IntroduceSection.tsx  # Introduce section (MISSING "use client")
      ProjectSection.tsx    # Projects grid (MISSING "use client")
```

### Pattern 1: Server/Client Component Boundary
**What:** In Next.js App Router, components are server components by default. Only components that use hooks, event handlers, browser APIs, or framer-motion need `"use client"`.
**When to use:** Every component file must be evaluated for whether it needs client-side features.
**Key rule:** `page.tsx` should be a server component that composes client section components. The `"use client"` boundary is at the import boundary -- once a file has `"use client"`, all its children are also client components.

```typescript
// page.tsx -- SERVER component (no "use client")
import HeroSection from "@/components/sections/HeroSection";  // client
import IntroduceSection from "@/components/sections/IntroduceSection";  // client

export default function Home() {
  return (
    <main className="relative bg-white w-full text-black z-20">
      <HeroSection />
      <IntroduceSection />
      {/* ... */}
    </main>
  );
}
```

**Why page.tsx can be server component:** It has no hooks, no event handlers, no browser APIs. It only imports and renders child components. Each child already has (or will have) its own `"use client"` directive.

### Pattern 2: Loading Screen with AnimatePresence
**What:** Use framer-motion's `AnimatePresence` for smooth exit animations, then conditionally remove from DOM.
**When to use:** When a component needs to animate out before unmounting.

```typescript
// Source: framer-motion AnimatePresence pattern
import { AnimatePresence, motion } from "framer-motion";

// In parent (layout.tsx):
<AnimatePresence>
  {showLoading && <LoadingScreen key="loader" onComplete={() => setShowLoading(false)} />}
</AnimatePresence>

// In LoadingScreen:
<motion.div
  initial={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
>
  {/* spinner content */}
</motion.div>
```

### Pattern 3: Scroll-Driven Animation with Named Constants
**What:** Extract scroll transform values into named constants with descriptive names.
**When to use:** When useTransform has opaque numeric arrays.

```typescript
// Instead of magic numbers:
const quoteScale = useTransform(scrollYProgress, [0.15, 0.6, 1.0], [1, 70, 220]);
const quoteTranslateY = useTransform(scrollYProgress, [0.15, 0.6, 1], ["0%", "1700%", "5200%"]);

// Extract as named constants:
const SCROLL_RANGES = {
  VIDEO_EXPAND_START: 0,
  VIDEO_EXPAND_END: 0.07,
  QUOTE_FADE_IN_START: 0.07,
  QUOTE_FADE_IN_END: 0.1,
  QUOTE_ZOOM_START: 0.15,
  QUOTE_ZOOM_MID: 0.6,
  QUOTE_ZOOM_END: 1.0,
} as const;

const QUOTE_SCALES = {
  INITIAL: 1,
  MID: 70,
  FINAL: 220,
} as const;
```

### Anti-Patterns to Avoid
- **Race condition in loading screen:** Never use `setTimeout` racing with `window.addEventListener('load')`. Both can fire independently, causing double state updates. Use a single combined approach: Promise.all with readyState check and minimum timer.
- **Animating height for dismissal:** `h-screen` to `h-0` with `transition-all` causes layout reflow on every frame. Use `transform: scale()` and `opacity` which are compositor-only properties (per fixing-motion-performance skill).
- **basePath env var for root domain:** `NEXT_PUBLIC_BASE_PATH=""` with string concatenation like `${basePath}${src}` works but is unnecessary complexity when deploying to root. Remove the abstraction entirely.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Exit animations | Manual CSS transition + setTimeout for unmount | framer-motion `AnimatePresence` + `exit` prop | AnimatePresence handles the unmount timing automatically, preventing the component from being removed before animation completes |
| Scroll progress tracking | Manual scroll event listeners with getBoundingClientRect | framer-motion `useScroll` + `useTransform` | Already used in HeroSection -- useScroll handles passive listeners and cleanup automatically |
| Intersection observation | Manual IntersectionObserver setup/teardown | framer-motion `useInView` hook | Already used in AnimatedDiv -- handles ref, observer lifecycle, and SSR safety |

**Key insight:** The codebase already uses framer-motion for animation. The LoadingScreen is the one component that bypasses framer-motion and uses raw CSS transitions + manual DOM manipulation. Converting it to use framer-motion patterns (AnimatePresence, motion.div exit) will be more consistent and performant.

## Common Pitfalls

### Pitfall 1: LoadingScreen AnimatePresence Requires Layout Component Awareness
**What goes wrong:** If LoadingScreen uses AnimatePresence in its own file but the parent conditionally renders it with a state variable, the AnimatePresence must wrap the conditional in the parent, not inside the child.
**Why it happens:** AnimatePresence needs to detect when its direct children are removed from the React tree.
**How to avoid:** AnimatePresence goes in `layout.tsx` (or a client wrapper around LoadingScreen placement), wrapping the conditional render of `<LoadingScreen />`. LoadingScreen itself just has `exit` props on its motion elements.
**Warning signs:** Component disappears instantly without exit animation.

### Pitfall 2: layout.tsx Cannot Be a Client Component
**What goes wrong:** Adding `"use client"` to layout.tsx to manage LoadingScreen state would lose the server-component metadata export capability.
**Why it happens:** `metadata` export only works in server components.
**How to avoid:** Keep layout.tsx as server component. Create a `ClientLayout` wrapper component with `"use client"` that manages LoadingScreen state, and use it inside layout.tsx's body. Or keep LoadingScreen self-managing (internal state, no parent coordination needed).
**Warning signs:** Build error: "You are attempting to export 'metadata' from a component marked with 'use client'".

### Pitfall 3: Static Export basePath Must Be Empty String or Undefined for Root Domain
**What goes wrong:** Setting `basePath: ''` (empty string) can behave differently than omitting basePath entirely in some Next.js versions.
**Why it happens:** Next.js treats `basePath: ''` as explicitly set but empty, vs `undefined` which is "not configured".
**How to avoid:** Remove basePath and assetPrefix entirely from next.config.ts when deploying to root domain. Don't set them to empty string.
**Warning signs:** Asset 404s in production, doubled slashes in URLs.

### Pitfall 4: Removing "use client" from page.tsx Might Cause Build Errors If It Imports Client-Only Modules
**What goes wrong:** Server components can import client components (those with `"use client"`), but they cannot import modules that use browser APIs without the directive.
**Why it happens:** When page.tsx is a server component, Next.js will try to evaluate its imports during SSR/build.
**How to avoid:** Ensure each section component (HeroSection, IntroduceSection, etc.) has its own `"use client"` directive before removing it from page.tsx.
**Warning signs:** Build error about `window`, `document`, or hooks being used in a server component.

### Pitfall 5: next.config.ts vs next.config.js Extension
**What goes wrong:** The current file uses `module.exports` (CommonJS) in a file that might be named `.ts`. Next.js 15 supports both but TypeScript config uses ESM exports.
**Why it happens:** Mismatch between file extension and module system.
**How to avoid:** Verify the actual file extension. If `.ts`, use `export default`. If `.js`, `module.exports` is fine. The current git history shows the file is named `next.config.ts` but uses `module.exports` -- this should be converted to proper TypeScript ESM syntax.
**Warning signs:** Config not loading, build warnings about module format.

### Pitfall 6: document.readyState Check Timing
**What goes wrong:** Checking `document.readyState === 'complete'` inside useEffect may already be `complete` by the time the component mounts (especially in development with Fast Refresh), causing the loading screen to dismiss immediately without the minimum display time.
**Why it happens:** In dev mode, hot reloading means the document is already loaded when components re-mount.
**How to avoid:** Always enforce the minimum display time regardless of readyState. Use a pattern like:
```typescript
const readyPromise = new Promise<void>((resolve) => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.addEventListener('load', () => resolve(), { once: true });
  }
});
const minTimePromise = new Promise<void>((resolve) => setTimeout(resolve, 1500));
Promise.all([readyPromise, minTimePromise]).then(() => {
  // begin exit animation
});
```
**Warning signs:** Loading screen flashes briefly and disappears in dev mode.

## Code Examples

### Example 1: LoadingScreen Rewrite Pattern
```typescript
// Source: framer-motion docs + fixing-motion-performance skill rules
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bouncy } from "ldrs/react";
import { Reuleaux } from "ldrs/react";
import "ldrs/react/Bouncy.css";
import "ldrs/react/Reuleaux.css";

const MIN_DISPLAY_MS = 1500;

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = "hidden";

    const readyPromise = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });
    const minTimePromise = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_DISPLAY_MS)
    );

    // Timeout fallback -- never stay stuck
    const timeoutPromise = new Promise<void>((resolve) =>
      setTimeout(resolve, 8000)
    );

    Promise.race([
      Promise.all([readyPromise, minTimePromise]),
      timeoutPromise,
    ]).then(() => {
      setPhase("exiting");
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleExitComplete = () => {
    setPhase("done");
    document.body.style.overflow = "";
  };

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      initial={{ opacity: 1, scale: 1 }}
      animate={
        phase === "exiting"
          ? { opacity: 0, scale: 0.95 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (phase === "exiting") handleExitComplete();
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Reuleaux
          size="37"
          stroke="5"
          strokeLength="0.15"
          bgOpacity="0.1"
          speed="1.2"
          color="black"
        />
        <Bouncy size="45" speed="1.75" color="black" />
      </div>
    </motion.div>
  );
}
```

### Example 2: Simplified next.config.ts (No basePath)
```typescript
// Source: Next.js official docs -- static export configuration
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: "export",
};

export default nextConfig;
```

### Example 3: BaseVideo Without basePath
```typescript
"use client";
import { CSSProperties } from "react";

interface BaseVideoProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

const BaseVideo = ({ src, className = "", style = {} }: BaseVideoProps) => {
  return (
    <video
      src={src}
      className={className}
      style={{ ...style, pointerEvents: "none" }}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
    />
  );
};

export default BaseVideo;
```

### Example 4: BaseImage Without basePath
```typescript
"use client";
import Image from "next/image";

interface BaseImageProps {
  src: string;
  alt: string;
  className?: string;
}

const BaseImage = ({ src, alt, className = "" }: BaseImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority
    />
  );
};

export default BaseImage;
```

### Example 5: Named Scroll Constants for HeroSection
```typescript
// Extract all magic numbers as named constants at module level
const SCROLL_KEYFRAMES = {
  // Video expansion phase
  VIDEO_EXPAND_START: 0,
  VIDEO_EXPAND_END: 0.07,
  // Quote fade-in phase
  QUOTE_FADE_START: 0.07,
  QUOTE_FADE_END: 0.1,
  // Quote zoom phase
  QUOTE_ZOOM_START: 0.15,
  QUOTE_ZOOM_MID: 0.6,
  QUOTE_ZOOM_END: 1.0,
} as const;

const QUOTE_TRANSFORM = {
  SCALE: { INITIAL: 1, MID: 70, FINAL: 220 },
  TRANSLATE_Y: { INITIAL: "0%", MID: "1700%", FINAL: "5200%" },
} as const;

const VIDEO_TRANSFORM = {
  BORDER_RADIUS: { INITIAL: "2rem", FINAL: "0rem" },
} as const;

// The 95px offset used in initialScale calculation
const HERO_HEADER_OFFSET_PX = 95;

// Section total scroll height -- controls animation pacing
const HERO_SCROLL_HEIGHT = "1100vh";
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI command | `output: 'export'` in next.config | Next.js 14.0.0 | Must use config-based approach |
| `module.exports` in next.config.js | `export default` in next.config.ts | Next.js 15 | TypeScript config support is standard |
| `forwardRef` for refs | Direct ref prop (React 19) | React 19.0.0 | No forwardRef needed in this codebase |
| `useContext(Context)` | `use(Context)` available | React 19.0.0 | Optional migration, not needed for Phase 1 |
| framer-motion (package name) | motion (rebranded to motion.dev) | 2024 | Import paths `framer-motion` still work via compatibility |

**Deprecated/outdated:**
- `NEXT_PUBLIC_BASE_PATH` pattern: Not needed when deploying to root domain. The entire basePath/assetPrefix system is for subdirectory deployments only.
- `quanmofii.github.io` domain: The repo is now `rayquasar18.github.io` -- all references must be updated.

## Open Questions

1. **What is the exact file extension of next.config?**
   - What we know: Git history shows `next.config.ts` in the file list, but the content uses `module.exports` (CommonJS)
   - What's unclear: Whether this causes issues with Next.js 15.3.1
   - Recommendation: Convert to proper TypeScript ESM syntax (`export default`) during the basePath cleanup task

2. **Should h-[1100vh] be adjusted?**
   - What we know: This controls total scroll distance for the hero animation. User granted discretion.
   - What's unclear: Whether current value provides good pacing across devices
   - Recommendation: Keep as-is for Phase 1, extract as named constant. Phase 5 replaces the hero entirely.

3. **Should the quote zoom scale values be made responsive?**
   - What we know: Current scales [1, 70, 220] and translateY ["0%", "1700%", "5200%"] are fixed. User granted discretion.
   - What's unclear: How these look on very small or very large screens
   - Recommendation: Extract as named constants for now. Making them responsive adds complexity for a hero section that Phase 5 will replace entirely.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework configured |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FNDN-01 | All client components have "use client" when needed; page.tsx is server component | manual-only | `npx next build` (build succeeds without hydration errors) | N/A |
| FNDN-02 | No basePath references remain; all URLs point to rayquasar18.github.io | manual-only | `grep -r "quanmofii" src/` should return empty; `grep -r "BASE_PATH" src/` should return empty | N/A |
| FNDN-04 | LoadingScreen transitions smoothly; no layout jump; no race condition | manual-only | `npm run dev` and visually verify; `npx next build` succeeds | N/A |
| UX-05 | CV download button works at root domain | manual-only | Verify `/HaMinhQuan_CV.pdf` exists in public/ and is accessible after build | N/A |

### Sampling Rate
- **Per task commit:** `npx next build` -- ensures static export succeeds
- **Per wave merge:** Full build + manual visual inspection in dev mode
- **Phase gate:** `npx next build` succeeds without errors + `npm run dev` shows no console hydration errors

### Wave 0 Gaps
- [ ] No test framework installed -- Phase 1 is bug fixes verified by successful build + visual inspection
- [ ] All validation for this phase is build-time and manual -- acceptable because Phase 1 is purely fixing existing broken behavior, not adding new features
- [ ] `npx next build` serves as the primary automated gate (static export will fail on SSR/hydration issues)

*(Note: A test framework is not needed for Phase 1. The bugs are verifiable through build success and visual inspection. Test infrastructure can be added in a later phase if desired.)*

## Sources

### Primary (HIGH confidence)
- [Next.js Static Exports docs](https://nextjs.org/docs/app/guides/static-exports) - Static export configuration, supported features, deployment
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - `"use client"` directive behavior, boundary rules, when to use
- [Next.js basePath docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath) - basePath configuration, image handling, link behavior
- Source code analysis (git history) - All 18 component files read and analyzed for hooks, browser APIs, and framer-motion usage

### Secondary (MEDIUM confidence)
- [fixing-motion-performance skill](.agents/skills/fixing-motion-performance/SKILL.md) - Animation performance rules: use transform/opacity over layout properties, avoid animating height
- [vercel-react-best-practices skill](.agents/skills/vercel-react-best-practices/SKILL.md) - Client/server component patterns, bundle optimization, re-render optimization
- [vercel-composition-patterns skill](.agents/skills/vercel-composition-patterns/SKILL.md) - Component architecture, React 19 APIs

### Tertiary (LOW confidence)
- None -- all findings verified with official docs or direct source code analysis

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and verified in package.json
- Architecture: HIGH - "use client" rules well-documented in official Next.js docs; component audit completed against source code
- Pitfalls: HIGH - Each pitfall identified from actual bugs found in source code analysis
- LoadingScreen pattern: MEDIUM - The scale+fade approach is sound (per motion performance skill), but exact timing values (1.5s min, 8s timeout) may need tuning during implementation

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- existing tech, no fast-moving dependencies)
