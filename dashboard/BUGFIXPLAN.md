# Dashboard Bug Fix Plan

## Workflow
Fix bugs one by one. After each fix, describe what changed on the dashboard. User manually verifies before proceeding to the next bug.

---

## Bug 1 — ResourceDetail Modal Never Opens
**Status:** Fixed
**Files:** `src/components/resources/ResourceActions.tsx`, `src/components/resources/ResourceDetail.tsx`
**Problem:** "View Details" calls `setSelectedResourceId` but no dialog ever opens. ResourceDetail exists but is disconnected.
**Fix:** Wire the View Details action to open a dialog with resource info.

---

## Bug 2 — ResourceForm Dependencies Parsing Broken
**Status:** Fixed
**Files:** `src/components/resources/ResourceForm.tsx`
**Problem:** Dependencies input is a plain text field but Zod schema expects `string[]`. Submitting causes a type mismatch.
**Fix:** Split comma-separated string into array before calling `addResource()`.

---

## Bug 3 — ResourcesMigratedCard Invalid Tailwind Class
**Status:** Fixed
**Files:** `src/components/metrics/ResourcesMigratedCard.tsx`
**Problem:** Progress bar uses `transition-width` which doesn't exist in Tailwind 4. Animation is broken.
**Fix:** Change to `transition-all duration-500`.

---

## Bug 4 — MigrationMap Chart Cell Rendering Bug
**Status:** Fixed
**Files:** `src/components/map/MigrationMap.tsx`
**Problem:** `<Cell>` inside `<BarChart>` uses unsupported render-function-as-children pattern. Bar colors likely wrong.
**Fix:** Apply `fill` directly as a `Cell` prop or via `Bar`'s data array.

---

## Bug 5 — Edit Resource Not Implemented
**Status:** Fixed
**Files:** `src/components/resources/ResourceActions.tsx`
**Problem:** "Edit" dropdown item shows alert "not yet implemented".
**Fix:** Add an edit dialog pre-populated with current resource data; submit calls `updateResource()`.

---

## Bug 6 — RtoCard Hardcoded Progress Arc
**Status:** Fixed
**Files:** `src/components/metrics/RtoCard.tsx`
**Problem:** SVG arc hardcoded to 60% — doesn't reflect real data.
**Fix:** Compute progress dynamically from store/corridor data.

---

## Bug 7 — TopBar Hardcoded Sync Time & Notification Count
**Status:** Fixed
**Files:** `src/components/layout/TopBar.tsx`
**Problem:** Notification badge hardcoded to `3`; sync time hardcoded to `"2m ago"`.
**Fix:** Derive notification count from store (warnings/errors); compute sync time dynamically.
