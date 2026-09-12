# DECISIONS
Newest first.

---

Date: September 12, 2026
Decision: Adopt repo documentation standard and the Plan, Build, Independent Review, Fix workflow. Local commits replace GitHub web editor uploads.
Consequences: Docs are verified against the file; several function names from earlier sessions did not exist and were corrected.

---

Date: (carried forward)
Decision: Single-file architecture is fixed.
Reason: Deploy simplicity; Dave edits and deploys from phone and GitHub web editor.
Consequences: Strict editing discipline and pre-output audit are mandatory.

---

Date: (carried forward)
Decision: Unified 0 to 100 fit score with one user-facing tag vocabulary (Reach, Target, Safety, Conflict, Pending). "Fit" and "Unknown" removed from screens.
Reason: Users could not interpret mixed vocabularies.
Consequences: `calcCollegeFit()` still uses Fit and Unknown as internal keys; keep them internal.

---

Date: (carried forward)
Decision: Critical saves bypass debounce (`saveAppDataNow()` plus immediate sync).
Reason: iOS tab suspension caused data loss.

---

Date: (carried forward)
Decision: Themes consolidated from four to two (`dark`, `light` in `setTheme()`).

---

Date: (carried forward)
Decision: Rebuild broken blocks cleanly instead of patching.
Reason: Layered patches accumulated stale state and cascading bugs.

---
