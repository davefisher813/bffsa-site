# CURRENT STATE
Last Updated: September 12, 2026. Rewritten from `git log`, the file, and a byte comparison with the live site.

## PRIORITIES

1. Decide on the roster load inconsistency and the hardcoded staff PINs (see ISSUES) before the next feature.
2. Desktop sidebar persistence across admin screens.
3. Deferred visual restyle (only when Dave starts it).

## ACTIVE

Platform
Status: Stable at app.bffsa.org. The deployed file is byte-identical to main (commit 9560b1a, June 12, 2026). No work in flight. Repo cloned to `C:\Users\davef\Documents\bffsa-platform` on September 12, 2026.

Checks run on the untouched file (September 12, 2026): one inline script passes `node --check`; zero `type="date"`; zero `new Function` and `eval`; three CDN scripts.

## WAITING

Nothing recorded.

## ISSUES

- `loadAppData()` (line 3273) includes `roster` in the restore key list although the comment above it says the hardcoded roster is the source of truth and roster is excluded. Saved roster overwrites the hardcoded one before the per-athlete merge runs. Decide which behavior is intended; do not change it inside an unrelated task.
- Three staff PINs are hardcoded in the seed data (lines 4301 to 4303) and the file is served to every visitor. Move them to config or Supabase.
- 114 em dashes in `index.html` and 5 in the Netlify functions, mostly comments and seeded copy. Remove when touching a line; do not sweep.
- Help text at line 4228 advertises four themes; the code has two.
- Google Fonts (Cormorant Garamond, DM Sans) are loaded but not applied.
- Desktop sidebar does not persist on non-home admin screens.
- iOS scroll padding on specific screens; fix individually when flagged.
- The docs from earlier sessions referenced `_persistEntryBase64()`, `getDivisionAcademicDefaults()`, a 6MB cap, and 45/30/25 fit weights. None exist in the repo. The repo file is authoritative.
- Netlify site name and Supabase project id are not in the repo (unverified).

## RECENT DECISIONS

9/12 Repo doc standard adopted. See DECISIONS.md.
