---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Full Page Redesign
status: Ready to plan
stopped_at: Completed 30-01-PLAN.md
last_updated: "2026-04-01T16:45:43.838Z"
last_activity: 2026-04-01
progress:
  total_phases: 11
  completed_phases: 7
  total_plans: 13
  completed_plans: 13
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** A polished, performant portfolio that showcases AI engineering expertise through clean architecture, smooth animations, and compelling content
**Current focus:** Phase 30 — projects

## Current Position

Phase: 34
Plan: Not started
Note: Phase 34 (Blog Redesign) was executed out-of-order (depends only on Phase 24) and is now complete.

## Performance Metrics

**Velocity:**

- v2.0: 18 plans across 8 phases in 2 days
- v2.1: 5 plans across 5 phases in 3 days
- Total plans completed: 33 (4 from v1.0 + 18 from v2.0 + 5 from v2.1 + 3 from Phase 34 + 2 quick fixes + 1 Phase 30)

## Accumulated Context

### Decisions

Archived with v2.1 milestone. See .planning/milestones/v2.1-ROADMAP.md for full history.

- [Phase 24]: Event delegation for cursor: document mouseover/mouseout with target.closest() for dynamic element support
- [Phase 24]: CSS keyframes for TypingIndicator instead of GSAP -- lightweight infinite animation
- [Phase 24]: GSAP delayed unmount pattern in ChatBar replaces AnimatePresence
- [Phase 24-01]: Ref-counted scroll lock at module level allows multiple overlays to coordinate without race conditions
- [Phase 24-01]: MenuOverlay scroll lock removed per D-12, deferred to Phase 25 header redesign
- [Phase 25]: Static export incompatible with router.replace for locale switch — use window.location directly
- [Phase 25]: Dots rotation in PillButton needs position:absolute inside fixed container to prevent width jitter
- [Phase 25]: TextRoll pattern: overflow:hidden wrapper with two span.roll-text children, GSAP translateY -100% on hover
- [Phase 26]: SVG clipPath with objectBoundingBox for resolution-independent curved curtain reveal
- [Phase 26]: Single proxy tween (curve + slide) ensures bezier and translation share same easing
- [Phase 26]: sessionStorage 'rq-preloader-seen' flag added for same-session homepage skip (PREL-03)
- [Phase 27-hero]: Native <img> with eager loading for hero photo (static export, unoptimized images config)
- [Phase 27-hero]: CSS keyframe pulse for scroll indicator instead of GSAP infinite tween (lightweight)
- [Phase 27-hero]: English subtitle/scroll text kept for both locales -- brand tagline, not informational
- [Phase 28-about]: ServicesBlock as separate client component composed into AboutSection for clean separation
- [Phase 28-about]: Task 2 (MiniQuoteSection wiring) verified as already complete from Plan 01 - no duplicate work

- [Phase 34]: IntersectionObserver for TOC active heading instead of ScrollTrigger — lighter, off main thread
- [Phase 34]: CSS Grid replaced CSS columns for blog masonry — better performance
- [Phase 34]: Native <img> for blog cards instead of Next/Image (static export, unoptimized config)

- [Phase 30]: Keep ProjectGrid for /projects listing page — cannot delete, still used by listing page
- [Phase 30]: data-parallax-image/data-parallax-text attributes for GSAP element targeting without ref forwarding

### Pending Todos

None.

### Blockers/Concerns

None.

### Roadmap Evolution

- Phase 34 added: Blog Redesign — Redesign /blog listing and /blog/[slug] post pages with v3.0 visual quality

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | Fix HeroSection: seamless marquee loop, scroll-reverse direction, larger text, Dennis Snellenberg-style layout with marquee at bottom | 2026-03-15 | 8026546 | [1-fix-herosection-seamless-marquee-loop-sc](./quick/1-fix-herosection-seamless-marquee-loop-sc/) |
| 2 | Fix hero marquee loop glitch, instant scroll reversal, offset role text right | 2026-03-15 | e0c4494 | [2-fix-hero-marquee-loop-glitch-instant-scr](./quick/2-fix-hero-marquee-loop-glitch-instant-scr/) |
| 3 | Fix preloader page flash: CSS visibility hiding + inline session check | 2026-03-20 | 9815492 | [260320-qhy-fix-preloader-page-flash-main-content-vi](./quick/260320-qhy-fix-preloader-page-flash-main-content-vi/) |
| Phase 20 P01 | 2min | 2 tasks | 8 files |
| Phase 21 P01 | 3min | 2 tasks | 6 files |
| Phase 23 P01 | 2min | 2 tasks | 4 files |
| Phase 24 P02 | 2min | 1 tasks | 1 files |
| Phase 24 P03 | 4min | 2 tasks | 5 files |
| Phase 24-01 P01 | 6min | 2 tasks | 5 files |
| Phase 27-hero P01 | 2min | 2 tasks | 5 files |
| 260325-wum | Fix hero bugs: image tracking, preloader timing overlap, bidirectional scroll, remove width constraint | 2026-03-25 | 3defd61 | [260325-wum-fix-hero-bugs](./quick/260325-wum-fix-hero-bugs/) |
| 260325-x8z | Hero text styling: unbold title, smaller font, tighter gap, 3-edge blur | 2026-03-25 | 2a2dc3c | [260325-x8z-hero-text-styling-and-edge-blur](./quick/260325-x8z-hero-text-styling-and-edge-blur/) |
| 260326-a1b | Text up, enlarge photo, tighter entrance timing, header entrance anim | 2026-03-26 | afb906c | - |
| 260326-0n6 | Move edge gradients inside photoRef for parallax sync | 2026-03-26 | 466a266 | [260326-0n6-research-and-fix-edge-gradients-to-follo](./quick/260326-0n6-research-and-fix-edge-gradients-to-follo/) |
| 260326-0wa | Fix hero: enlarge gradients, 90vh image, increase min-width | 2026-03-26 | 44e2a22 | [260326-0wa-fix-hero-enlarge-gradients-to-overlap-im](./quick/260326-0wa-fix-hero-enlarge-gradients-to-overlap-im/) |
| 260326-1gp | Add name buttons row in hero with outline and dark pill buttons | 2026-03-26 | 33e85f3 | [260326-1gp-add-name-buttons-row-in-hero-section-wit](./quick/260326-1gp-add-name-buttons-row-in-hero-section-wit/) |
| 260326-77d | Fix hero blur: replace backdrop-blur spans with text-shadow, add mt-5 to buttons row | 2026-03-26 | f3c9e3a | [260326-77d-fix-hero-blur-and-add-mt-5-to-buttons-ro](./quick/260326-77d-fix-hero-blur-and-add-mt-5-to-buttons-ro/) |
| Phase 28-about P02 | 2min | 2 tasks | 2 files |
| 260326-ce0 | Fix about section UI: remove dividers, fix quote font, fix image, add spacing, fix width, remove service numbers | 2026-03-26 | 7fcedff | [260326-ce0-fix-about-section-ui-remove-dividers-fix](./quick/260326-ce0-fix-about-section-ui-remove-dividers-fix/) |
| 260327-81i | Adjust about section: wider gaps, more heading margin, shorter images, stronger bottom parallax | 2026-03-27 | a62905f | [260327-81i-adjust-about-section-spacing-increase-ga](./quick/260327-81i-adjust-about-section-spacing-increase-ga/) |

| 260327-a3m | Fix CV button hover animation, responsive grid layout, header container alignment | 2026-03-27 | b4bbdbe | [260327-a3m-fix-cv-button-hover-animation-reduce-bot](./quick/260327-a3m-fix-cv-button-hover-animation-reduce-bot/) |
| 260401-5a0 | Fix blog UI/UX scroll jank: remove filter blur from scroll animations, add image dimensions, optimize CSS | 2026-03-31 | fd69ab2 | [260401-5a0-fix-blog-ui-ux-scroll-jank-remove-filter](./quick/260401-5a0-fix-blog-ui-ux-scroll-jank-remove-filter/) |
| 260401-5qj | Deep fix scroll jank: GPU layer for noise overlay, overwrite:auto on scroll tweens, remove backdrop-blur, CSS Grid for blog, IntersectionObserver for TOC, quickTo for cursor | 2026-03-31 | ac26b02 | [260401-5qj-deep-fix-scroll-jank-body-overlay-gpu-la](./quick/260401-5qj-deep-fix-scroll-jank-body-overlay-gpu-la/) |
| 260401-6dr | Fix menu nav links on blog page: navigate to homepage before scrolling to section | 2026-03-31 | 3aa6afb | [260401-6dr-fix-menu-nav-links-on-blog-page-navigate](./quick/260401-6dr-fix-menu-nav-links-on-blog-page-navigate/) |
| 260402-b4i | Replace all fonts with Satoshi Variable (neo-grotesque, similar to TWK Lausanne) | 2026-04-02 | 4fc1fcb | [260402-b4i-replace-all-fonts-with-font-eloquia](./quick/260402-b4i-replace-all-fonts-with-font-eloquia/) |
| 260402-gpq | Fix water ripple effect: preserve image aspect ratio in fragment shader (cover-style UV mapping) | 2026-04-02 | ~~7253aa0~~ reverted | [260402-gpq-fix-water-ripple-effect-image-stretch-di](./quick/260402-gpq-fix-water-ripple-effect-image-stretch-di/) |
| 260402-hs1 | Fix water ripple: correct cover-UV mapping (pre-computed coverScale vec2) | 2026-04-02 | a65bf4e | [260402-hs1-fix-water-ripple-implement-correct-cover](./quick/260402-hs1-fix-water-ripple-implement-correct-cover/) |
| 260402-i8o | Expand water ripple to fill entire container (orthographic camera + 2x2 fullscreen quad) | 2026-04-02 | 30ebaa1 | [260402-i8o-expand-water-ripple-canvas-to-fill-entir](./quick/260402-i8o-expand-water-ripple-canvas-to-fill-entir/) |
| 260402-i8o-2 | Contain mode: canvas resizes to exact image aspect ratio, no cropping | 2026-04-02 | 2f7391d | - |
| 260402-i8o-3 | Width-first canvas: full-width render with native image height, parent clips overflow | 2026-04-02 | 21f58d0 | - |
| 260402-i8o-4 | Cover mode: canvas fills container, overflows clipped by parent, ripple covers visible area | 2026-04-02 | 97bfbaf | - |
| 260402-j1k | Apply water ripple effect to StrengthBlock image in about section | 2026-04-02 | bc20281 | - |
| 260409-r0y | Fix project section overflow - add container wrapper like other sections | 2026-04-09 | 45cf08c | [260409-r0y-fix-project-section-overflow-add-contain](./quick/260409-r0y-fix-project-section-overflow-add-contain/) |
| 260514-93y | Add homepage preloading animation with white overlay, QUASAR PORTFOLIO split text, centered image expansion, and preserve hero | 2026-05-13 | 4d86c60 | [260514-93y-b-y-gi-t-i-mu-n-b-n-l-n-plan-c-n-th-n-v-](./quick/260514-93y-b-y-gi-t-i-mu-n-b-n-l-n-plan-c-n-th-n-v-/) |

## Session Continuity

Last activity: 2026-05-13 - Completed quick task 260514-93y: Add homepage preloading animation with white overlay, QUASAR PORTFOLIO split text, centered image expansion, and preserve hero
Stopped at: Completed 30-01-PLAN.md
Resume file: None
