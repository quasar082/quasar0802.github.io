# Phase 3: 3D Robot Subsystem - Research

**Researched:** 2026-03-14
**Domain:** React Three Fiber (R3F) 3D rendering in Next.js 16 with static export
**Confidence:** HIGH

## Summary

This phase integrates a 3D robot model into the portfolio using React Three Fiber (R3F) v9, the standard React renderer for Three.js. The stack is fully compatible: R3F v9 requires React >=19 (project has 19.2.3), and drei v10 provides essential helpers for loading GLTF models, managing animations, and monitoring performance.

The critical architectural constraint is **Next.js static export** (`output: 'export'`). Three.js and R3F depend on browser APIs (`window`, `document`, WebGL context) that do not exist during the static build. All R3F imports must be wrapped with `next/dynamic` using `{ ssr: false }` to prevent build crashes. This is a locked decision from prior phases. Additionally, React Context cannot cross the R3F Canvas boundary -- Zustand (already installed) is the correct bridge for sharing emotion state between the React DOM tree and the 3D scene.

The current model in `model-3d/` is a placeholder dragon (~13MB, 1 animation). The actual robot model will be provided later. The architecture must handle both scenarios: working with the placeholder now and swapping in the robot model seamlessly. The 13MB file size is too large for production -- Draco compression or texture optimization should reduce this significantly.

**Primary recommendation:** Use `@react-three/fiber` v9 + `@react-three/drei` v10 + `three` v0.183, with `next/dynamic({ ssr: false })` wrapper, Zustand emotion store, `useGLTF` + `useAnimations` for model/animation loading, and `PerformanceMonitor` + `AdaptiveDpr` for mobile quality scaling.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ROBT-01 | Interactive 3D robot model rendered in hero section via React Three Fiber | R3F v9 Canvas + useGLTF + OrbitControls/PresentationControls for interaction. Dynamic import with ssr:false for Next.js compatibility. |
| ROBT-02 | Robot displays emotion-based animations (happy, sad, excited, thinking, idle) driven by Zustand state | Zustand store bridges Canvas boundary. useAnimations hook from drei manages AnimationAction crossfade. Current model has 1 clip; architecture must map emotion names to animation clips. |
| ROBT-03 | 3D model loads with Suspense fallback and graceful loading indicator | React Suspense wraps Canvas children. drei useProgress hook tracks loading percentage. Loading component shown outside Canvas in DOM layer. |
| ROBT-04 | Robot is wrapped with dynamic({ ssr: false }) to prevent static export build crash | next/dynamic with { ssr: false } prevents Three.js from being evaluated during SSR/static generation. Must wrap the entire component that imports R3F, not just Canvas. |
| ROBT-05 | Robot renders performantly on mobile devices with reduced quality fallback | drei PerformanceMonitor auto-detects FPS drops. AdaptiveDpr lowers pixel ratio. Canvas dpr prop caps maximum. Texture size reduction for mobile via renderer capabilities check. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | 0.183.2 | 3D rendering engine | Industry standard WebGL library; R3F renders Three.js objects |
| `@react-three/fiber` | 9.5.0 | React renderer for Three.js | Official pmndrs React integration; v9 requires React >=19 (matches project) |
| `@react-three/drei` | 10.7.7 | R3F helper library | Provides useGLTF, useAnimations, useProgress, PerformanceMonitor, AdaptiveDpr, OrbitControls |
| `zustand` | 5.0.11 (installed) | State management | Already in project; required to bridge React DOM <-> Canvas boundary (Context cannot cross) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@types/three` | 0.183.1 | TypeScript types for Three.js | Always -- provides Mesh, Group, AnimationClip, AnimationAction types |
| `three-stdlib` | (bundled with drei) | Three.js examples as ESM modules | Used internally by drei; no separate install needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@react-three/drei` useGLTF | raw Three.js GLTFLoader | drei handles Draco decoder path, preloading, caching. Raw loader is verbose and error-prone. |
| `OrbitControls` | `PresentationControls` | PresentationControls provides spring-based drag rotation without zoom -- better for a "look at the robot" hero UX. OrbitControls is better for full 3D exploration. Recommend PresentationControls for hero section. |
| `PerformanceMonitor` | Manual FPS detection | PerformanceMonitor is battle-tested, handles flipflop detection, and integrates with AdaptiveDpr. No reason to hand-roll. |

### Not Needed
| Library | Why Not |
|---------|---------|
| `@react-three/postprocessing` | No post-processing effects required for the robot. Keep bundle small. |
| `@react-three/rapier` | No physics needed. Robot is decorative/animated, not physically simulated. |
| `leva` | Debug GUI for development only. Not needed in production portfolio. |

**Installation:**
```bash
npm install three @react-three/fiber @react-three/drei @types/three
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    robot/
      RobotCanvas.tsx          # The dynamic-imported wrapper (ssr: false boundary)
      RobotScene.tsx            # Canvas + lights + camera + Suspense children
      RobotModel.tsx            # useGLTF + useAnimations + emotion controller
      RobotLoadingIndicator.tsx # DOM-based loading UI (outside Canvas)
      EmotionController.tsx     # Subscribes to Zustand, drives animation transitions
  stores/
    useRobotStore.ts            # Zustand store: emotion, loading state, performance tier
  types/
    robot.ts                    # RobotEmotion union type, animation clip names
```

### Pattern 1: Dynamic Import Boundary (SSR Prevention)
**What:** Wrap the entire R3F component tree in a `next/dynamic` call with `{ ssr: false }`
**When to use:** Always, for any component that imports from `@react-three/fiber`, `@react-three/drei`, or `three`
**Why:** Three.js accesses `window`, `document`, `navigator` at import time. Even unused imports will crash the static export build.

```typescript
// src/components/robot/RobotCanvas.tsx
'use client';

import dynamic from 'next/dynamic';
import { RobotLoadingIndicator } from './RobotLoadingIndicator';

const RobotScene = dynamic(() => import('./RobotScene'), {
  ssr: false,
  loading: () => <RobotLoadingIndicator />,
});

export function RobotCanvas() {
  return (
    <div className="h-[400px] w-full md:h-[600px]">
      <RobotScene />
    </div>
  );
}
```

**Critical rule:** The `dynamic()` call must be in a file that does NOT import `three`, `@react-three/fiber`, or `@react-three/drei` at the top level. The dynamic import boundary must be clean.

### Pattern 2: Zustand Store as Canvas Bridge
**What:** Use a Zustand store to share state between DOM components and the R3F Canvas
**When to use:** Any time DOM-side code needs to communicate with the 3D scene

```typescript
// src/stores/useRobotStore.ts
import { create } from 'zustand';

export type RobotEmotion = 'idle' | 'happy' | 'sad' | 'excited' | 'thinking';

interface RobotState {
  emotion: RobotEmotion;
  isModelLoaded: boolean;
  performanceTier: 'high' | 'low';
  setEmotion: (emotion: RobotEmotion) => void;
  setModelLoaded: (loaded: boolean) => void;
  setPerformanceTier: (tier: 'high' | 'low') => void;
}

export const useRobotStore = create<RobotState>((set) => ({
  emotion: 'idle',
  isModelLoaded: false,
  performanceTier: 'high',
  setEmotion: (emotion) => set({ emotion }),
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  setPerformanceTier: (tier) => set({ performanceTier: tier }),
}));
```

**Why Zustand and not Context:** React Context does not propagate across the R3F Canvas boundary. The Canvas creates a separate React reconciler. Zustand stores are module-level singletons that both reconcilers can subscribe to.

### Pattern 3: GLTF Loading with useGLTF + useAnimations
**What:** Load GLTF/GLB models with built-in caching, Draco support, and animation management
**When to use:** Loading any 3D model with animations

```typescript
// src/components/robot/RobotModel.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useRobotStore } from '@/stores/useRobotStore';

// Model path relative to public/
const MODEL_PATH = '/models/robot.glb';

export function RobotModel() {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions, mixer } = useAnimations(animations, groupRef);
  const emotion = useRobotStore((s) => s.emotion);
  const setModelLoaded = useRobotStore((s) => s.setModelLoaded);

  // Signal that model has loaded
  useEffect(() => {
    setModelLoaded(true);
    return () => setModelLoaded(false);
  }, [setModelLoaded]);

  // Map emotions to animation clip names
  // IMPORTANT: These names must match the actual clip names in the .glb file
  // Run: console.log(animations.map(a => a.name)) to discover them
  useEffect(() => {
    const clipName = emotionToClipName(emotion);
    const action = actions[clipName];
    if (action) {
      // Crossfade from current animation to new one
      Object.values(actions).forEach((a) => a?.fadeOut(0.5));
      action.reset().fadeIn(0.5).play();
    }
  }, [emotion, actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model so it starts downloading immediately
useGLTF.preload(MODEL_PATH);
```

### Pattern 4: Performance Adaptive Rendering
**What:** Automatically detect device performance and reduce quality on weak hardware
**When to use:** Always, to ensure mobile devices do not crash or stutter

```typescript
// Inside RobotScene.tsx
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useRobotStore } from '@/stores/useRobotStore';

export default function RobotScene() {
  const setPerformanceTier = useRobotStore((s) => s.setPerformanceTier);

  return (
    <Canvas
      dpr={[1, 2]}  // Allow DPR range; AdaptiveDpr will adjust within this
      camera={{ position: [0, 1, 5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'default' }}
    >
      <PerformanceMonitor
        onDecline={() => setPerformanceTier('low')}
        onIncline={() => setPerformanceTier('high')}
        flipflops={3}
        onFallback={() => setPerformanceTier('low')}
      >
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>
      {/* ... scene content ... */}
    </Canvas>
  );
}
```

### Pattern 5: Loading Progress Indicator
**What:** Show loading progress while the 3D model downloads
**When to use:** Required by ROBT-03

```typescript
// DOM-based loading indicator (outside Canvas)
import { useProgress } from '@react-three/drei';

export function RobotLoadingOverlay() {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-base">
      <div className="text-center">
        <div className="text-accent text-lg font-display">
          Loading Robot...
        </div>
        <div className="mt-2 h-1 w-48 rounded bg-border overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
```

**Important:** `useProgress` is a Zustand store internally. It works across the Canvas boundary natively. Place the loading indicator in DOM space (outside Canvas), not inside the 3D scene.

### Anti-Patterns to Avoid
- **Importing Three.js in a server component:** Any file that imports `three`, `@react-three/fiber`, or `@react-three/drei` at the top level MUST be client-only. The `dynamic({ ssr: false })` boundary must be in a file that does NOT have these imports.
- **Using React Context to pass state into Canvas:** Context providers in the DOM tree are invisible inside the Canvas. Use Zustand.
- **Putting loading UI inside Canvas:** Loading states should be DOM elements overlaid on the Canvas container, not 3D objects. This ensures they render while the WebGL context initializes.
- **Large uncompressed models in public/:** The current dragon model is 13MB. Models should be Draco-compressed and textures optimized before placing in `public/`.
- **Disposing in useEffect cleanup without checking:** Three.js objects need manual disposal, but `useGLTF` handles this. Do not call `scene.traverse(o => o.dispose())` on GLTF-loaded scenes managed by drei -- it causes errors on re-render.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GLTF model loading | Custom GLTFLoader setup with Draco config | `useGLTF` from drei | Handles caching, Draco decoder path, preloading, proper disposal |
| Animation management | Manual AnimationMixer + clock tracking | `useAnimations` from drei | Provides typed actions map, auto-creates mixer, auto-disposes on unmount |
| Loading progress tracking | Custom XHR progress events | `useProgress` from drei | Tracks all Three.js DefaultLoadingManager events, provides progress/active/item |
| Performance adaptation | Manual FPS counter + quality toggling | `PerformanceMonitor` + `AdaptiveDpr` | Handles flipflop detection, averaging windows, DPR adjustment |
| Orbit/drag controls | Manual pointer event math + camera updates | `PresentationControls` or `OrbitControls` from drei | Spring physics, touch support, damping, zoom limits |
| SSR prevention | Custom typeof window checks | `next/dynamic({ ssr: false })` | Official Next.js pattern; ensures entire component tree is excluded from SSR |

**Key insight:** The pmndrs ecosystem (R3F + drei) is specifically designed to abstract away the boilerplate and footguns of raw Three.js in React. Every helper listed above handles edge cases (disposal, re-render stability, concurrent mode) that would take significant effort to replicate correctly.

## Common Pitfalls

### Pitfall 1: SSR Build Crash from Transitive Three.js Imports
**What goes wrong:** `npm run build` fails with `ReferenceError: window is not defined` or `document is not defined`
**Why it happens:** Any import chain that reaches `three` during SSR/static generation will crash because Three.js probes browser APIs at module evaluation time.
**How to avoid:** The `dynamic({ ssr: false })` wrapper must be in a file that has ZERO top-level imports from `three`, `@react-three/fiber`, or `@react-three/drei`. The dynamic import creates a clean boundary.
**Warning signs:** Build works in dev mode (which runs client-side) but fails on `next build`.

### Pitfall 2: Animation Clip Name Mismatch
**What goes wrong:** `actions['happy']` returns `null`, no animation plays
**Why it happens:** The actual clip names in the .glb file don't match the names used in code. They are set by the 3D artist in the modeling tool (e.g., "Take 001", "Armature|idle", "mixamo.com|walk").
**How to avoid:** Always log `animations.map(a => a.name)` when integrating a new model. Build the emotion-to-clip mapping as a separate config object, not hardcoded assumptions.
**Warning signs:** The current placeholder dragon has clip name "Take 001", not emotion names.

### Pitfall 3: React Context Not Crossing Canvas Boundary
**What goes wrong:** Components inside `<Canvas>` cannot access React context providers from the DOM tree (e.g., next-intl, theme context).
**Why it happens:** R3F Canvas uses a separate React reconciler (`react-reconciler`). React contexts are reconciler-scoped.
**How to avoid:** Use Zustand for state sharing. If you truly need Context inside Canvas, drei provides `useContextBridge`, but it adds complexity. For this project, Zustand is sufficient.
**Warning signs:** `useTranslations()` or other context hooks return undefined/error inside Canvas children.

### Pitfall 4: Model Too Large for Production
**What goes wrong:** 3D model takes 5-10+ seconds to download, user sees blank space
**Why it happens:** Unoptimized GLTF files with large textures (the current model has 12MB in textures alone)
**How to avoid:** (1) Use Draco compression for geometry (~60-80% reduction), (2) Compress textures to WebP or reduce resolution, (3) Use `useGLTF.preload()` to start download early, (4) Show a loading indicator (ROBT-03)
**Warning signs:** The current `dragon_celebration.glb` is 13MB. Target should be under 3MB for good UX.

### Pitfall 5: Memory Leaks from Undisposed Three.js Objects
**What goes wrong:** GPU memory grows on navigation, eventually crashes on mobile
**Why it happens:** Three.js geometries, materials, and textures must be manually disposed. React's garbage collector doesn't know about GPU resources.
**How to avoid:** `useGLTF` and R3F handle disposal on unmount automatically. Don't clone materials/geometries without managing their lifecycle. When using `primitive object={scene}`, the scene is shared and managed by the cache.
**Warning signs:** Performance degrades after navigating back and forth to the page.

### Pitfall 6: Canvas Sizing Issues
**What goes wrong:** Canvas renders at 0x0 pixels or fills the entire viewport unexpectedly
**Why it happens:** The R3F `<Canvas>` fills its parent container via CSS `position: absolute; inset: 0`. If the parent has no explicit height, it collapses.
**How to avoid:** Always give the Canvas wrapper div explicit dimensions: `className="h-[400px] w-full md:h-[600px]"` with `position: relative`.
**Warning signs:** Blank area where the robot should be, or robot overlapping other content.

## Code Examples

### Complete Dynamic Import Pattern for Next.js Static Export
```typescript
// src/components/robot/RobotCanvas.tsx
// This file MUST NOT import three, @react-three/fiber, or @react-three/drei
'use client';

import dynamic from 'next/dynamic';
import { RobotLoadingIndicator } from './RobotLoadingIndicator';

const RobotScene = dynamic(() => import('./RobotScene'), {
  ssr: false,
  loading: () => <RobotLoadingIndicator />,
});

export function RobotCanvas() {
  return (
    <div className="relative h-[400px] w-full md:h-[600px]">
      <RobotScene />
    </div>
  );
}
```

### Emotion-Driven Animation Crossfade
```typescript
// Animation transition with crossfade
function useEmotionAnimation(
  actions: Record<string, THREE.AnimationAction | null>,
  emotion: RobotEmotion,
  clipMap: Record<RobotEmotion, string>
) {
  const prevEmotion = useRef<RobotEmotion>(emotion);

  useEffect(() => {
    const prevClip = clipMap[prevEmotion.current];
    const nextClip = clipMap[emotion];

    const prevAction = actions[prevClip];
    const nextAction = actions[nextClip];

    if (nextAction) {
      if (prevAction && prevAction !== nextAction) {
        prevAction.fadeOut(0.5);
      }
      nextAction.reset().fadeIn(0.5).play();
    }

    prevEmotion.current = emotion;
  }, [emotion, actions, clipMap]);
}
```

### Mobile Performance Detection
```typescript
// Use inside Canvas
function AdaptiveQuality() {
  const setPerformanceTier = useRobotStore((s) => s.setPerformanceTier);

  return (
    <PerformanceMonitor
      onDecline={() => setPerformanceTier('low')}
      onIncline={() => setPerformanceTier('high')}
      flipflops={3}
      onFallback={() => setPerformanceTier('low')}
    >
      <AdaptiveDpr pixelated />
    </PerformanceMonitor>
  );
}

// Use in RobotModel to conditionally simplify
function RobotModel() {
  const performanceTier = useRobotStore((s) => s.performanceTier);
  // Reduce shadow map, disable post-processing, lower animation update rate
  // on low-performance devices
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| R3F v8 (React 18) | R3F v9 (React >=19 required) | 2024-2025 | v9 drops React 18 support; uses React 19 features. Project must use v9. |
| drei useGLTF with `@react-three/gltfjsx` | Still valid | Ongoing | gltfjsx generates typed component from .glb, but optional for simple use cases |
| Manual DPR scaling | `AdaptiveDpr` + `PerformanceMonitor` | drei v9+ | Automated performance monitoring replaces manual scaling code |
| `three/examples/jsm` imports | `three-stdlib` (via drei) | drei v9+ | drei uses `three-stdlib` for better tree-shaking and ESM compatibility |
| Class-based Three.js | Declarative JSX in R3F | R3F v1+ | All Three.js objects expressed as JSX elements with props |

**Deprecated/outdated:**
- `@react-three/fiber` v8: Does not support React 19. Do not install.
- `react-three-fiber` (old package name): Renamed to `@react-three/fiber` years ago.
- Direct `THREE.GLTFLoader` usage: Use drei's `useGLTF` which wraps it with caching, Draco, and React integration.

## Open Questions

1. **Actual Robot Model Not Yet Available**
   - What we know: The owner will provide a .glb/.gltf robot model. Currently a placeholder dragon exists in `model-3d/`.
   - What's unclear: Exact animation clip names, vertex count, texture sizes, whether the model has morph targets or only skeletal animation.
   - Recommendation: Build with the dragon placeholder. Create a config/mapping layer for emotion-to-clip-name so swapping the model only requires updating the mapping and the file path. Log clip names on first load.

2. **Emotion Animation Mapping**
   - What we know: 5 emotions needed (happy, sad, excited, thinking, idle). The actual robot may or may not have 5 separate clips.
   - What's unclear: Whether the robot model will have named clips matching emotions, or if emotions need to be synthesized from combinations (e.g., speed up idle for "excited").
   - Recommendation: Define `RobotEmotion` type as a union. Create `EMOTION_CLIP_MAP: Record<RobotEmotion, string>` config. For missing animations, fall back to idle with different playback speeds or simple procedural effects (bounce, sway).

3. **Model File Size Optimization**
   - What we know: Current dragon is 13MB (12MB textures, 0.7MB geometry). Production target should be under 3MB.
   - What's unclear: Whether the actual robot model will be similarly large.
   - Recommendation: Optimize any model before deploying. Use `gltf-pipeline` or `@gltf-transform/cli` for Draco compression. Resize textures to 1024x1024 max. Convert PNG textures to JPEG/WebP where alpha is not needed.

4. **Model Placement in Repository**
   - What we know: Models are in `model-3d/` (untracked). `public/` is the served static directory.
   - What's unclear: Whether the (potentially large) optimized model should be committed to git or served from a CDN.
   - Recommendation: Place the optimized model in `public/models/` for static export simplicity. If over 5MB after optimization, consider a CDN with the model URL configurable. For now, `public/models/` is correct.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- needs setup in Wave 0 |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ROBT-01 | 3D robot model renders in browser | manual-only | Visual verification in browser | N/A |
| ROBT-02 | Emotion animations play for 5 emotions | manual-only | Visual verification -- set each emotion in devtools/UI | N/A |
| ROBT-03 | Loading indicator shown during model download | manual-only | Throttle network in DevTools, observe loading state | N/A |
| ROBT-04 | Build succeeds without SSR errors | smoke | `npm run build` | N/A -- Wave 0 |
| ROBT-05 | Mobile renders at reduced quality | manual-only | DevTools mobile emulation + Chrome Performance panel | N/A |

**Justification for manual-only:** R3F/Three.js tests require WebGL context which is not available in Node.js test runners (Jest/Vitest) without complex mocking. The most reliable validation for 3D rendering is:
1. `npm run build` succeeds (ROBT-04 -- automated smoke test)
2. Visual inspection in browser for rendering, animation, loading, and performance

### Sampling Rate
- **Per task commit:** `npm run build` (verifies no SSR crash)
- **Per wave merge:** `npm run build` + manual browser check
- **Phase gate:** Build green + visual verification of all 5 success criteria

### Wave 0 Gaps
- [ ] No test framework installed -- for ROBT-04, a simple `npm run build` suffices as the smoke test
- [ ] Consider adding a build-test script to package.json: `"test:build": "next build"` for CI validation

## Sources

### Primary (HIGH confidence)
- `@react-three/fiber` v9.5.0 npm package -- peer deps verified: `react: ">=19 <19.3"`, `three: ">=0.156"`
- `@react-three/drei` v10.7.7 npm package -- peer deps verified: `react: "^19"`, `three: ">=0.159"`, `@react-three/fiber: "^9.0.0"`
- `three` v0.183.2 npm package
- `@types/three` v0.183.1 npm package
- drei TypeScript declarations (useGLTF, useAnimations, useProgress, PerformanceMonitor, AdaptiveDpr) -- read from npm package
- R3F Canvas TypeScript declarations -- read from npm package
- `next/dynamic` TypeScript declarations from Next.js 16.1.6 -- read from node_modules
- Model inspection: `dragon_celebration/scene.gltf` parsed for animations (1 clip: "Take 001"), meshes (9), vertices (~20,611), textures (4 files, ~12MB)

### Secondary (MEDIUM confidence)
- R3F official README from npm package -- confirmed basic usage patterns, installation instructions
- Architecture patterns (dynamic import, Zustand bridge, Canvas boundary) -- confirmed from prior project decisions in STATE.md and established R3F community patterns

### Tertiary (LOW confidence)
- None -- all claims verified through package inspection or official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified via npm, peer dependencies confirmed compatible with project (React 19.2.3, Next.js 16.1.6)
- Architecture: HIGH -- dynamic import pattern is documented in Next.js docs, Zustand bridge is a locked project decision from STATE.md, Canvas boundary behavior is fundamental to R3F's reconciler architecture
- Pitfalls: HIGH -- SSR crash, Context boundary, and model sizing are well-documented R3F + Next.js issues verified through package analysis
- Animation patterns: MEDIUM -- useAnimations API verified from types, but emotion-to-clip mapping depends on actual robot model (not yet available)

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable ecosystem; R3F v9 is current major version)
