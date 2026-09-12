# DESIGN SYSTEM
Values read from the CSS in `index.html` on September 12, 2026.

## Fonts

- Headings use `var(--HF)` and body uses `var(--BF)`. Both resolve to the system stack: `-apple-system, 'SF Pro Display' / 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif`.
- A Google Fonts link for Cormorant Garamond and DM Sans is present in the head but no rule applies those families. Do not assume serif headings here; that is the website's look, not the app's.

## Colors

Dark theme (default):

| Token | Value |
|---|---|
| --bg | #0c0c0c |
| --bg2 | #101010 |
| --bg3 | #161616 |
| --card | #1a1a1a |
| --card2 | #232323 |
| --card3 | #2a2a2a |
| --red | #c8180c |
| --red2 | #e83030 |
| --yel | #ffd60a |
| --tx | #ffffff |
| --tx2 | rgba(255,255,255,.92) |
| --tx3 | rgba(255,255,255,.72) |
| --sub | rgba(255,255,255,.55) |

Light theme (`body.light`): `--bg #f4f2ef`, `--card #ffffff`, `--red #c8150a`, `--red2 #ff3b2e`, `--yel #c47a00`, `--tx #000000`.

Radii: `--r 13px`, `--r-sm 8px`, `--r-lg 18px`. Safe areas: `--st`, `--sb`. Tile glow accents in green, red, and yellow.

The brand red `#c41e1e` and gold `#c9a84c` from the website appear once and zero times respectively. Use the tokens above, not those hex values.

## Rules

- No grey body text.
- No em dashes in new copy. No hyphenated compound words.
- Board-ready tone in governance content. "We" and "us", never "I".
- One consistent card style per theme. Two themes only, `dark` and `light`. Do not introduce a third.

## Recruiting UI

- College card and modal: two header buttons only (red "+ Add" and a "Sync" menu). Score circle leads the modal. (unverified against the rendered UI)
- Tag vocabulary on screen: Reach, Target, Safety, Conflict, Pending. The internal score map in `calcCollegeFit()` still uses `Fit` and `Unknown` as tag keys (line 10491); keep those out of anything user-facing.
- Confidence shown as per-axis dots (High, Medium, Pending). (unverified against the rendered UI)

## Layout

- iPhone Safari first at 390x844, then laptop. Breakpoints 767, 768, 1024; change related blocks together.
- Desktop sidebar should persist across admin screens (known incomplete).
- iOS scroll padding fixes are handled per screen; a previous global attempt was reverted.

## Visual testing

Open the real file in a browser. HTML mockups render blank on Dave's phone; test with the real file.

## Deferred

A JARVIS-style visual restyle and card redesign are planned. Do not start them inside unrelated tasks.
