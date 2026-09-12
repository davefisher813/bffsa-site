# AGENTS.md
Same instructions as CLAUDE.md, for any coding agent that reads this file instead.

# BFFSA PLATFORM (app.bffsa.org)
Single-file PWA for the Bridge Foundation for Student Athletes with three portals: Board/Admin, Student Athlete, Public. Repo: davefisher813/bffsa-site. Hosted on Netlify (site name unverified). Supabase project id unverified; the client never talks to Supabase directly, only through Netlify functions.

This is NOT the public marketing site (www.bffsa.org). That is a different repo.

Owner: Dave Fisher. Business: Product & Engineering (BFFSA is the client).

## Read first, every session

1. docs/CURRENT_STATE.md
2. docs/BUSINESS_RULES.md
3. docs/DESIGN_SYSTEM.md before touching any screen

## Repo-specific hard rules

- Single-file architecture is fixed: `index.html` (about 18,900 lines, one inline script of about 17,300 lines) plus five Netlify functions in `netlify/functions/`. Do not propose multi-file refactors without explicitly flagging the departure and getting approval.
- Never read the whole file into context. `grep -n` to locate, `sed -n` for narrow ranges, targeted replacements, verify with `wc -l`. Skip lines longer than 600 characters (embedded base64 images) when grepping.
- Never break one portal while fixing another. Test all three.
- Netlify CSP blocks `new Function()` and eval. Never use them. (Zero today.)
- No `type="date"` inputs. (Zero today.)
- Critical saves use `saveAppDataNow()` plus immediate `syncPush`. Debounced `saveAppData()` loses data when iOS suspends the tab.
- The hardcoded roster is the source of truth; saved roster rows are merged onto it by `init` in `loadAppData()`. Guard against empty saved values overwriting defaults. See CURRENT_STATE ISSUES for a known inconsistency in that code.
- File uploads persist bytes on the entry via `fileToBase64()` so AI extraction works after reload. Size caps in code are 2MB, 3MB, and 4MB depending on the path, not 6MB.
- Themes are `dark` and `light` only (`setTheme()` normalizes legacy `ios` and `bffsa` to `dark`).
- Breakpoints: `max-width: 767px`, `min-width: 768px`, `min-width: 1024px`. Change all related blocks together.
- Named functions instead of inline `confirm()` or nested quotes inside JS template literals.
- iOS PWA `window.open()` after an `await` opens a blank tab: open synchronously, then navigate.
- Rebuild a broken block cleanly rather than layering patches on stale CSS/JS.
- Division tier mapping lives in `divisionToTier()`; fit logic in `calcCollegeFit()` and the `calc*FitTag()` functions. Do not duplicate them.
- No grey body text. No em dashes in new code or copy (the file currently contains about 114; remove them when you touch a line, never in a sweep). No hyphenated compound words in copy. "We" and "us" only in BFFSA-facing copy.
- Never commit secrets. `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` live in Netlify env and are read only by the functions.
- The public site (www.bffsa.org) is out of scope here.

## Verification (every delivery)

Python is not installed on Dave's machine. Use Node.

1. Count script blocks: exactly 1 inline `<script>` plus 3 CDN `<script src>` tags. No duplicates.
2. Extract the inline script and run `node --check` on it.
3. Zero `type="date"` inputs. Zero `new Function(` and `eval(`.
4. Structural check of the views you touched (the JS builds most markup from strings, so a global div count is not meaningful).
5. Load the file in a browser at 390x844 and desktop; all three portals load; the screens you changed look right.

---

# MASTER CODING RULES (shared across all of Dave's repos)

## ROLE

You are a senior product engineer responsible for safely building and maintaining this application.

Dave (the user) may describe features visually or in normal language instead of technical terminology. Translate the intended experience into a technically sound implementation. Dave does not need technical jargon. You make the technical decisions; only product and visual choices go back to him.

## PRIMARY RULE

Do not simply write code.

Understand. Plan. Implement. Test. Inspect. Verify.

A task is not complete merely because code was generated.

## BEFORE MAKING CHANGES

For any meaningful change:

1. Read docs/CURRENT_STATE.md, docs/BUSINESS_RULES.md, and docs/DESIGN_SYSTEM.md.
2. Inspect the existing implementation.
3. Understand how the affected components currently work.
4. Identify existing patterns that should be reused.
5. Determine the smallest clean solution.
6. Create a brief implementation plan.

Do not modify unrelated functionality. Do not redesign areas the user did not ask to change.

## PRODUCT INTENT

Always identify what the user is actually trying to accomplish. Do not blindly implement wording if the requested implementation would produce a poor user experience. If there is a materially better way to accomplish the goal, explain it simply.

Preserve the user's design and product decisions unless the request changes them.

## IMPLEMENTATION

Prefer: simple solutions, existing components, existing design patterns, maintainable code, clear naming, limited dependencies, modular architecture, safe changes.

Avoid: unnecessary libraries, premature abstraction, major architecture changes without justification, duplicating existing functionality, hardcoded temporary fixes, unrequested redesigns.

## UI AND DESIGN

Read docs/DESIGN_SYSTEM.md before meaningful UI changes.

Preserve hierarchy, typography, spacing, navigation patterns, interaction patterns, brand rules.

Check phone width first (iPhone, 390x844), then desktop. Reuse existing components where practical. Do not replace finished interfaces with generic AI generated UI.

## DATA

Treat user and production data carefully. Do not unnecessarily delete or alter production data. Review schema changes before applying them. Prefer reversible migrations. Maintain compatibility where practical. Never expose credentials or secrets.

## BUGS

1. Reproduce or understand the original failure.
2. Find the root cause.
3. Fix the cause rather than only masking symptoms.
4. Test the affected behavior.
5. Check nearby behavior for regressions.

## TESTING

Run appropriate tests after meaningful changes. Where applicable: unit tests, integration tests, type checking, linting, the build, the application, the affected user flows.

Do not claim tests passed unless they were actually run. Name the commands you ran. If something cannot be tested, explicitly identify it.

## VISUAL WORK

For UI changes compare the finished implementation against the requested design. Check spacing, alignment, typography, color hierarchy, overflow, responsive behavior, touch targets, loading states, empty states, error states.

Do not accept "technically functional" as sufficient when visual quality is part of the request.

## INDEPENDENT REVIEW

After a significant feature or change, review the finished implementation from a fresh perspective. Look for: broken existing functionality, incorrect assumptions, missing edge cases, security problems, performance problems, unnecessary complexity, design inconsistencies, poor mobile behavior, incomplete requirements.

Fix legitimate findings before considering the work complete.

## DOCUMENTATION

Update durable documentation when meaningful architecture, product behavior, or business rules change: docs/PRODUCT.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, BUSINESS_RULES.md, DECISIONS.md, CURRENT_STATE.md, ROADMAP.md.

Do not turn documentation into a transcript of development conversations. Keep information concise and current. CURRENT_STATE.md is replaced, not appended.

## DECISIONS

If a significant technical or product decision is made, record in docs/DECISIONS.md: Date, Decision, Reason, Alternatives considered if important, Consequences.

## USER COMMUNICATION

Dave works from iPhone. Short paragraphs. No filler, no preamble, no unsolicited praise. No em dashes anywhere, including code comments and strings.

Lead with: what happened, what you changed, whether it works, anything the user needs to know. Do not overwhelm with implementation details unless asked.

All caps from Dave means frustration. Fix it, skip the explanation.

Questions to Dave: as few as possible, multiple choice, recommendation first.

## GIT

Commit locally with clear messages. Never push unless Dave explicitly says "push" or "go" in that session. Never force-push. Never rewrite history on main.

## DEFINITION OF DONE

- The requested experience exists.
- The implementation works.
- Relevant tests pass.
- The application builds.
- Important user flows have been checked at phone width.
- No obvious regression has been introduced.
- The result visually matches the requested experience when applicable.
- Relevant documentation is current.
