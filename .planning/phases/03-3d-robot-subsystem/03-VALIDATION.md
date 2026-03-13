---
phase: 3
slug: 3d-robot-subsystem
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — Wave 0 adds build smoke test |
| **Config file** | none — Wave 0 adds `test:build` script |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser check
- **Before `/gsd:verify-work`:** Full suite must be green + visual verification
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | ROBT-04 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | ROBT-01 | manual-only | Visual: robot renders in browser | N/A | ⬜ pending |
| 3-02-01 | 02 | 1 | ROBT-02 | manual-only | Visual: set each emotion, verify animation | N/A | ⬜ pending |
| 3-03-01 | 03 | 1 | ROBT-03 | manual-only | Throttle network, observe loading UI | N/A | ⬜ pending |
| 3-04-01 | 04 | 2 | ROBT-05 | manual-only | DevTools mobile emulation + perf panel | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Add `"test:build": "next build"` to package.json scripts — smoke test for ROBT-04
- [ ] Verify `npm run build` passes before any R3F code is added (baseline)

*Existing infrastructure note: No test framework (Jest/Vitest) needed for this phase. R3F/Three.js requires WebGL context unavailable in Node.js runners. Build smoke test is the primary automated validation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 3D robot renders visibly | ROBT-01 | Requires WebGL context + visual verification | Open page in browser, verify Canvas shows robot model (not blank) |
| 5 emotion animations play | ROBT-02 | Animation playback needs visual confirmation | Set each emotion via devtools/UI: happy, sad, excited, thinking, idle — verify distinct animation |
| Loading indicator shown | ROBT-03 | Must observe DOM loading state during network delay | Throttle to Slow 3G in DevTools → reload → verify progress bar appears |
| Mobile reduced quality | ROBT-05 | Performance tier detection needs real rendering | Open in mobile emulation (375px) → check Console for performance tier changes, verify no frame drops |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
