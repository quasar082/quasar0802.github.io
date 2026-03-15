# Phase 11: Animation Infrastructure - Research

**Researched:** 2026-03-15
**Domain:** GSAP + Lenis smooth scroll integration with Next.js 16 App Router (static export)
**Confidence:** HIGH

## Summary

Phase 11 installs three packages (gsap@3.14.2, @gsap/react@2.1.2, lenis@1.3.18), wires Lenis smooth scroll to GSAP ScrollTrigger, and establishes the foundational patterns every downstream animation phase depends on. The scope is deliberately narrow: install, configure, bridge, and validate. No visual animations are built in this phase -- only the plumbing.

The most critical technical detail discovered during research is that `ReactLenis` defaults `autoRaf: true`, which means Lenis runs its own `requestAnimationFrame` loop. When syncing with GSAP's ticker (required for ScrollTrigger accuracy), `autoRaf` MUST be set to `false` in the options to avoid double RAF loops causing scroll position desync. This was verified by reading the actual `lenis-react.mjs` source code from the 1.3.18 package.

The existing codebase has a clean separation: the layout is a Server Component that renders client components (Header, ChatBar). Lenis wraps content via `ReactLenis root` which does NOT create wrapper divs (verified from source). All existing Framer Motion usage (ChatBar, MobileMenu, ChatPanel, TypingIndicator) is isolated to specific components and will NOT conflict with GSAP as long as they never share DOM elements.

**Primary recommendation:** Create `src/lib/gsap.ts` for one-time plugin registration, create `src/components/providers/SmoothScrollProvider.tsx` with ReactLenis + ScrollTrigger bridge, wrap layout children, and verify with a single test ScrollTrigger animation that fires correctly during smooth scroll.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | Lenis smooth scroll wraps the entire app with GSAP ScrollTrigger sync | SmoothScrollProvider pattern with ReactLenis root + ScrollTrigger bridge component; autoRaf:false + gsap.ticker driving Lenis RAF; lenis.css import for required base styles |
| ANIM-02 | GSAP plugin registration module (ScrollTrigger, SplitText, Flip, CustomEase) | src/lib/gsap.ts barrel export with gsap.registerPlugin(); all plugins verified present in gsap@3.14.2 free package |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | Animation engine, ScrollTrigger, SplitText, Flip, CustomEase, Observer | De facto standard for scroll-driven, timeline-based animations. Free tier includes all plugins needed. |
| @gsap/react | 2.1.2 | `useGSAP()` hook for automatic GSAP context cleanup | Official React integration. Prevents zombie ScrollTrigger instances on unmount. Handles SSR fallback (useLayoutEffect -> useEffect). |
| lenis | 1.3.18 | Smooth scroll with lerp-based interpolation | MIT-licensed. Ships React bindings at `lenis/react`. Standard pairing with GSAP ScrollTrigger for portfolio sites. Last published 2026-03-04. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lenis/react | (bundled) | `ReactLenis` component + `useLenis` hook | Always -- wraps app in smooth scroll context |
| lenis/dist/lenis.css | (bundled) | Base CSS for Lenis (html height, data-lenis-prevent, etc.) | Always -- must be imported for correct behavior |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lenis | GSAP ScrollSmoother | ScrollSmoother requires paid GSAP Club membership. Lenis is MIT and free. |
| Lenis | locomotive-scroll | Predecessor to Lenis by same team. Lenis is the successor -- lighter and better maintained. |
| @gsap/react useGSAP | Manual gsap.context() in useEffect | Error-prone cleanup. useGSAP is 2KB and prevents the #1 GSAP+React memory leak. |

**Installation:**
```bash
npm install gsap @gsap/react lenis
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  lib/
    gsap.ts              # Plugin registration barrel (ANIM-02)
  components/
    providers/
      SmoothScrollProvider.tsx  # ReactLenis + ScrollTrigger bridge (ANIM-01)
  app/
    globals.css           # Add lenis.css import
    [lang]/
      layout.tsx          # Wrap children in SmoothScrollProvider
      page.tsx            # Existing -- add data-lenis-prevent on R3F wrapper
```

### Pattern 1: GSAP Plugin Registration Module
**What:** Single file that registers all GSAP plugins once and re-exports them.
**When to use:** Always. Every component imports from `@/lib/gsap` instead of directly from `gsap/*`.
**Why:** Prevents duplicate registration, ensures plugins are available before use, single source of truth.

```typescript
// src/lib/gsap.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP };
```

**Source:** @gsap/react README (verified from package): `gsap.registerPlugin(useGSAP)` is the recommended way to register the hook.

### Pattern 2: SmoothScrollProvider with ScrollTrigger Bridge
**What:** Client component that initializes Lenis in root mode and bridges scroll events to ScrollTrigger.
**When to use:** Mounted once in the root layout. Never per-page.

**CRITICAL DETAIL (verified from lenis-react.mjs source):**
- `ReactLenis` component defaults `autoRaf` to `true` (line 55 of source)
- When using GSAP ticker to drive Lenis, you MUST set `autoRaf: false` via the `options` prop
- Passing `autoRaf={false}` as a prop also works but `options.autoRaf` takes precedence

```typescript
// src/components/providers/SmoothScrollProvider.tsx
'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,  // CRITICAL: disable Lenis own RAF -- GSAP ticker drives it
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

/**
 * Bridges Lenis scroll to GSAP ScrollTrigger.
 *
 * Pattern from Lenis official README (GSAP ScrollTrigger section):
 * 1. lenis.on('scroll', ScrollTrigger.update) -- sync scroll position
 * 2. gsap.ticker.add() drives lenis.raf() -- single RAF loop
 * 3. gsap.ticker.lagSmoothing(0) -- prevent GSAP from throttling
 */
function ScrollTriggerBridge() {
  const lenisRef = useRef<InstanceType<typeof import('lenis').default> | null>(null);

  // Get lenis instance via useLenis hook
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenisRef.current = lenis;

    // Sync: pipe Lenis scroll events into ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single RAF source)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  return null;
}
```

**Confidence: HIGH** -- Pattern matches Lenis official README exactly. The `autoRaf: false` requirement is verified from reading the actual ReactLenis source code.

### Pattern 3: useGSAP Hook for All Animations
**What:** Every component that creates GSAP animations uses `useGSAP` instead of `useEffect`.
**When to use:** Always. No exceptions.

```typescript
'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.reveal-element', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef }); // scope limits selectors to container descendants

  return (
    <div ref={containerRef}>
      <div className="reveal-element">Content</div>
    </div>
  );
}
```

**Source:** @gsap/react README (verified from package). Key points:
- `scope` limits `querySelector` to descendants of the ref -- prevents cross-component targeting
- Default empty dependency array (no accidental re-execution on every render)
- Returns `{ context, contextSafe }` -- use `contextSafe` for event handlers created after initial execution
- Automatic cleanup via `context.revert()` kills all ScrollTrigger instances on unmount

### Pattern 4: Layout Integration
**What:** Wrap layout children in SmoothScrollProvider, preserving existing Server Component structure.

```typescript
// Modified: src/app/[lang]/layout.tsx
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export default async function LocaleLayout({ children, params }) {
  // ... existing locale setup unchanged ...
  return (
    <html lang={lang}>
      <body className={`${marlinGeo.variable} ${saprona.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main className="pt-16">{children}</main>
            <ChatBar />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Why this works:** `ReactLenis root` with `root={true}` does NOT create wrapper/content divs (verified from source, line 126-127). It simply provides context to children. Lenis controls `window` scroll via the `html` element. Fixed-position elements (Header z-50, ChatBar z-50) work correctly because Lenis root mode uses native scroll position, not CSS transforms.

### Pattern 5: R3F Canvas Scroll Prevention
**What:** Add `data-lenis-prevent` to the R3F Canvas wrapper to prevent Lenis from intercepting scroll/touch events inside the 3D viewport.

```typescript
// Modified: src/components/robot/RobotCanvas.tsx
export function RobotCanvas() {
  return (
    <div className="relative h-[400px] w-full md:h-[600px]" data-lenis-prevent>
      <RobotScene />
    </div>
  );
}
```

**Why:** PresentationControls in RobotScene uses pointer/touch events for rotation. Without `data-lenis-prevent`, Lenis would intercept these events and smooth them, breaking the 3D interaction. The `data-lenis-prevent` attribute is documented in the official Lenis README and supported via the required `lenis.css` stylesheet.

### Anti-Patterns to Avoid
- **Using `useEffect` for GSAP animations:** Causes zombie ScrollTrigger instances that persist after component unmount. ALWAYS use `useGSAP`.
- **Keeping `autoRaf: true` (the default) when using GSAP ticker:** Creates double RAF loops causing scroll position desync and jittery animations.
- **Importing from `gsap/ScrollTrigger` directly instead of `@/lib/gsap`:** Risks unregistered plugins. Always import from the barrel.
- **Wrapping only `<main>` in ReactLenis instead of the full content:** Header scroll detection would be outside Lenis context. Wrap everything inside body.
- **Using Lenis in non-root mode (wrapper div):** Would break `position: fixed` on Header and ChatBar. Always use `root` mode.
- **Calling `gsap.registerPlugin()` inside components:** Causes re-registration on every render. Register once in `src/lib/gsap.ts`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll | Custom lerp + RAF loop | Lenis `ReactLenis root` | Handles edge cases: Safari 60fps cap, nested scroll, touch devices, `data-lenis-prevent`, anchor links |
| GSAP cleanup in React | Manual `gsap.context()` + `useEffect` | `useGSAP` from `@gsap/react` | 2KB package handles SSR fallback, strict mode, automatic context.revert() |
| ScrollTrigger scroll source sync | Custom scrollerProxy | Lenis `root` mode + `lenis.on('scroll', ScrollTrigger.update)` | Root mode uses native scroll position -- no proxy needed. Lenis v1.x eliminated the scrollerProxy requirement. |
| Plugin registration guard | `if (!ScrollTrigger.isRegistered)` checks | Single `gsap.registerPlugin()` in `src/lib/gsap.ts` | Module-level registration runs once. ES module deduplication guarantees single execution. |
| Text splitting for animations | Manual span wrapping | GSAP `SplitText` (included free in 3.14.2) | Handles line detection, resize reversion, proper whitespace preservation. Defer actual usage to Phase 16. |

**Key insight:** The Lenis + GSAP integration pattern is well-established and documented in Lenis's official README. The bridge is ~15 lines of code. Hand-rolling alternatives (custom scrollerProxy, manual RAF management) adds complexity with no benefit.

## Common Pitfalls

### Pitfall 1: Double RAF Loop (ReactLenis autoRaf default)
**What goes wrong:** ReactLenis defaults `autoRaf` to `true`. When you also add `gsap.ticker.add(lenis.raf)`, Lenis runs its RAF twice per frame. Scroll position updates twice, causing jitter and doubled momentum.
**Why it happens:** The ReactLenis component source (verified, line 55) sets `autoRaf = true` in the default destructuring. Most tutorials show the vanilla Lenis pattern (where `autoRaf` defaults to `false` in the constructor) but don't account for the React wrapper's different default.
**How to avoid:** Pass `options={{ autoRaf: false }}` to `ReactLenis`. Verified from source: `options.autoRaf` takes precedence over the `autoRaf` prop.
**Warning signs:** Scroll feels "too fast" or "too slippery". Lenis velocity reports double expected values.

### Pitfall 2: ScrollTrigger Zombie Instances on Route Change
**What goes wrong:** GSAP ScrollTrigger instances created in `useEffect` persist after component unmount. Navigating from homepage to blog and back creates duplicate triggers targeting non-existent DOM elements.
**Why it happens:** GSAP operates outside React's lifecycle. ScrollTrigger instances are registered globally. Without explicit cleanup, they accumulate.
**How to avoid:** Use `useGSAP` exclusively. It creates a `gsap.context()` scoped to a ref and calls `context.revert()` on unmount, killing all animations and ScrollTriggers created within.
**Warning signs:** `ScrollTrigger.getAll().length` grows after each navigation. Console warnings about targeting null elements. Scroll behavior degrades over time.

### Pitfall 3: GSAP Module-Level Code Fails During SSR/Build
**What goes wrong:** `gsap.registerPlugin()` at the module level in a file imported by a Server Component references `window` internally, causing "window is not defined" during `npm run build`.
**Why it happens:** Next.js static export runs all Server Component code in Node.js. If a Server Component imports a module that transitively imports GSAP, the module-level code executes server-side.
**How to avoid:** Ensure `src/lib/gsap.ts` has the `'use client'` directive. The layout imports `SmoothScrollProvider` which is already a client component, creating the client boundary. Never import `@/lib/gsap` from a Server Component.
**Warning signs:** `npm run build` fails with "window is not defined" or "document is not defined".

### Pitfall 4: Lenis CSS Not Imported
**What goes wrong:** Without `lenis/dist/lenis.css`, the `data-lenis-prevent` attribute has no effect (it relies on CSS `overscroll-behavior: contain`). The `html.lenis` class that Lenis adds has no styling. Stopped scroll state (`lenis-stopped` class) doesn't apply `overflow: clip`.
**Why it happens:** Lenis's README mentions importing CSS but it's easy to miss. The smooth scroll itself works without CSS, so developers think CSS is optional.
**How to avoid:** Import `lenis/dist/lenis.css` in `globals.css` or in `SmoothScrollProvider.tsx`.
**Warning signs:** `data-lenis-prevent` on R3F Canvas has no effect -- touch events still intercepted by Lenis. Scroll doesn't fully stop when `lenis.stop()` is called.

### Pitfall 5: ScrollTrigger Position Miscalculation After Layout Changes
**What goes wrong:** ScrollTrigger calculates element positions on creation. If content changes (font loads, images load, language switch changes text length), trigger positions are wrong.
**Why it happens:** ScrollTrigger uses `getBoundingClientRect()` once. It does not automatically recalculate on layout changes.
**How to avoid:** Call `ScrollTrigger.refresh()` after any layout-affecting event: font load complete, image load, language switch, preloader exit. Set `invalidateOnRefresh: true` on triggers that should recalculate on window resize.
**Warning signs:** Animations fire too early or too late. Problem is inconsistent across page loads. Calling `ScrollTrigger.refresh()` manually in console fixes it.

### Pitfall 6: Framer Motion and GSAP Targeting Same Element
**What goes wrong:** Both libraries write to `element.style.transform`. The last writer wins per frame, causing jank.
**Why it happens:** The existing ChatBar, MobileMenu, ChatPanel, and TypingIndicator use Framer Motion. If GSAP ever animates a parent element that contains these, transforms conflict.
**How to avoid:** Hard boundary: GSAP animates only elements inside `<main>` and the preloader. Framer Motion elements (ChatBar, MobileMenu) are siblings to `<main>`, never children. In this phase, just verify the existing Framer Motion components still work after adding Lenis.
**Warning signs:** ChatPanel slide-up animation stutters. AnimatePresence exit doesn't play.

## Code Examples

### Example 1: Complete SmoothScrollProvider (verified pattern)
```typescript
// Source: Lenis 1.3.18 README (GSAP ScrollTrigger section) + ReactLenis source code inspection
'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false, // GSAP ticker drives Lenis
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  return null;
}
```

### Example 2: Verification ScrollTrigger Animation
```typescript
// Simple fade-in-on-scroll to verify GSAP + Lenis + ScrollTrigger integration works
'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export function ScrollTriggerTest() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.st-test-box', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        markers: true, // DEV ONLY: visual markers to verify trigger positions
      },
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} style={{ marginTop: '100vh' }}>
      <div className="st-test-box">
        ScrollTrigger works if this fades in on scroll
      </div>
    </div>
  );
}
```

### Example 3: gsap.ts Plugin Registration
```typescript
// Source: GSAP npm package exports + @gsap/react README
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, Observer, useGSAP };
```

### Example 4: R3F Canvas with data-lenis-prevent
```typescript
// Source: Lenis README -- data-lenis-prevent attribute documentation
'use client';

import dynamic from 'next/dynamic';
import { RobotLoadingIndicator } from './RobotLoadingIndicator';

const RobotScene = dynamic(() => import('./RobotScene'), {
  ssr: false,
  loading: () => <RobotLoadingIndicator />,
});

export function RobotCanvas() {
  return (
    <div className="relative h-[400px] w-full md:h-[600px]" data-lenis-prevent>
      <RobotScene />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lenis with scrollerProxy for ScrollTrigger | Lenis `root` mode -- no scrollerProxy needed | Lenis v1.0 (2024) | Simpler setup. Root mode uses native scroll position. |
| Manual `gsap.context()` in `useEffect` | `useGSAP()` hook from `@gsap/react` | @gsap/react 2.0 (2024) | Automatic cleanup, SSR-safe, strict mode compatible |
| `@studio-freight/lenis` package | `lenis` package (renamed) | 2024 | Same library, new name under darkroom.engineering |
| SplitText as paid GSAP Club plugin | SplitText included free in gsap 3.12+ | GSAP 3.12 (2024) | No need for separate `split-type` package |
| `ReactLenis autoRaf` prop | `options.autoRaf` (autoRaf prop deprecated) | Lenis 1.3.x | Use `options.autoRaf: false` when driving from GSAP ticker |

**Deprecated/outdated:**
- `@studio-freight/lenis`: Old package name. Use `lenis` directly.
- `gsap-trial`: Unnecessary. All needed plugins are in the free `gsap` package.
- `ScrollTrigger.scrollerProxy()`: Not needed with Lenis root mode.
- `split-type`: Replaced by GSAP's built-in `SplitText` (free since 3.12).

## Open Questions

1. **Lenis behavior on mobile touch devices**
   - What we know: Lenis `smoothWheel: true` affects wheel events. Touch scroll is native by default. `syncTouch: false` (default) means touch scrolling is unsmoothed.
   - What's unclear: Whether the added lerp on wheel events affects perceived performance on mobile devices that also have trackpads (iPad with Magic Keyboard).
   - Recommendation: Test on real devices during implementation. If touch scroll feels laggy, can disable Lenis on `(pointer: coarse)` devices. This is a Phase 11 validation item, not a blocker.

2. **ScrollTrigger.refresh() timing after future preloader (Phase 13)**
   - What we know: ScrollTrigger calculates positions on creation. The preloader (Phase 13) will hide content, making positions wrong.
   - What's unclear: Exact timing needed between preloader exit and ScrollTrigger.refresh().
   - Recommendation: Phase 11 should export a `refreshScrollTrigger()` utility from `@/lib/gsap` that downstream phases call. Phase 13 will use it after preloader completes.

3. **Lenis CSS `html.lenis` class application timing**
   - What we know: Lenis adds `lenis` and `lenis-smooth` classes to `<html>` after initialization. The CSS targets these.
   - What's unclear: Whether there's a flash of unstyled scroll between HTML render and Lenis initialization in static export.
   - Recommendation: Not a concern for Phase 11 since the preloader (Phase 13) will lock scroll before Lenis activates. For Phase 11 testing, the brief native scroll before hydration is acceptable.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Next.js build validation (no unit test framework installed) |
| Config file | none -- build validation via `npm run build` |
| Quick run command | `npm run build` |
| Full suite command | `npm run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANIM-01 | Lenis smooth scroll active, ScrollTrigger fires in sync | smoke (manual) | `npm run dev` + scroll test | N/A -- manual verification |
| ANIM-01 | Static export builds without SSR errors | build | `npm run build` | Exists (next.config.ts) |
| ANIM-01 | No Lenis/GSAP window/document errors during build | build | `npm run build 2>&1 \| grep -i "window\|document\|is not defined"` | Exists |
| ANIM-02 | Plugin registration module exports all plugins | smoke (manual) | `npm run dev` + import test | N/A -- Wave 0 |
| ANIM-02 | All registered plugins are accessible | type-check | `npx tsc --noEmit` | Exists (tsconfig.json) |

### Sampling Rate
- **Per task commit:** `npm run build` (must pass -- catches SSR errors)
- **Per wave merge:** `npm run build` + manual scroll verification in dev
- **Phase gate:** Full build green + manual verification of all 4 success criteria

### Wave 0 Gaps
- [ ] No automated test framework (jest/vitest) installed -- build validation is sufficient for infrastructure phase
- [ ] Manual verification checklist needed for scroll smoothness and ScrollTrigger sync (cannot be automated without browser testing framework)

## Sources

### Primary (HIGH confidence)
- **npm registry** (live queries 2026-03-15):
  - `gsap@3.14.2` -- version, exports map, plugin availability confirmed
  - `@gsap/react@2.1.2` -- version, peerDependencies (`gsap ^3.12.5`, `react >=17`), type definitions
  - `lenis@1.3.18` -- version, exports map (`lenis/react` subpath confirmed), peerDependencies (`react >=17.0.0`)
- **Package source inspection** (extracted from npm tarballs 2026-03-15):
  - `lenis@1.3.18/dist/lenis-react.mjs` -- FULL source read. Confirmed: `autoRaf` defaults to `true` (line 55), `root={true}` skips wrapper divs (line 126), `useLenis` callback pattern
  - `lenis@1.3.18/dist/lenis-react.d.ts` -- FULL type definitions read. Confirmed: `ReactLenis`, `useLenis`, `LenisContext` exports, `LenisProps.root` accepts `boolean | 'asChild'`
  - `lenis@1.3.18/dist/lenis.css` -- FULL read. Contains `html.lenis` rules, `data-lenis-prevent` overscroll-behavior, `lenis-stopped` overflow clip
  - `lenis@1.3.18/README.md` -- FULL read. Confirmed GSAP ScrollTrigger integration pattern, `autoRaf` option, `data-lenis-prevent` attributes, all settings/properties/methods
  - `@gsap/react@2.1.2/types/index.d.ts` -- FULL read. Confirmed `useGSAP` signature, `useGSAPConfig` interface (`scope`, `dependencies`, `revertOnUpdate`)
  - `@gsap/react@2.1.2/README.md` -- FULL read. Confirmed `contextSafe` pattern, `scope` usage, `gsap.registerPlugin(useGSAP)` recommendation
- **Existing codebase** (read 2026-03-15):
  - `src/app/[lang]/layout.tsx` -- Server Component, current structure
  - `src/app/[lang]/page.tsx` -- Client component, RobotCanvas placement
  - `src/components/Header.tsx` -- `window.scrollY` listener, fixed position
  - `src/components/robot/RobotCanvas.tsx` -- dynamic import boundary
  - `src/components/robot/RobotScene.tsx` -- Canvas with PresentationControls
  - `src/components/chat/ChatBar.tsx` -- AnimatePresence, fixed position
  - `src/components/MobileMenu.tsx` -- Framer Motion usage
  - `src/app/globals.css` -- Current dark theme tokens, scrollbar styles
  - `package.json` -- Current dependencies confirmed
  - `next.config.ts` -- `output: 'export'` confirmed

### Secondary (MEDIUM confidence)
- GSAP React integration guide: https://gsap.com/resources/React/ -- training data, patterns confirmed by package inspection
- GSAP ScrollTrigger documentation: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ -- training data, core API stable
- Lenis documentation: https://lenis.darkroom.engineering/ -- training data, confirmed by README

### Tertiary (LOW confidence)
- None -- all findings verified from package source or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified via npm registry live queries, peer dependencies confirmed compatible
- Architecture: HIGH -- patterns verified from actual package source code (not just documentation). ReactLenis autoRaf default confirmed, root mode behavior confirmed, useLenis hook implementation confirmed.
- Pitfalls: HIGH -- pitfalls derived from verified source behavior (autoRaf double-RAF) and well-established GSAP+React patterns (zombie ScrollTrigger). Framer Motion boundary concern verified from existing codebase component inventory.
- Integration with existing code: HIGH -- all affected files read and analyzed. Header scroll listener, ChatBar fixed positioning, R3F Canvas dynamic import all verified compatible.

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (packages are stable; lenis last published 2026-03-04, gsap last published 2025-12-12)
