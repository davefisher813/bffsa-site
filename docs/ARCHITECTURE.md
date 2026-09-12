# ARCHITECTURE
Verified against the repo on September 12, 2026 (commit 9560b1a). Lines marked (unverified) could not be confirmed from the code.

## Stack

- One HTML file, `index.html`: 18,902 lines, 1.2MB, one inline script of about 17,300 lines plus inline CSS and base64 images. No framework. No `package.json`. No build step.
- CDN scripts: SheetJS xlsx 0.18.5, mammoth 1.6.0 (docx), PapaParse 5.4.1 (csv).
- Netlify functions in `netlify/functions/`, Node 18, raw `fetch`, no npm dependencies (`netlify.toml` sets esbuild bundler and Node 18 for `sync` and `claude`):
  - `claude.js`: proxies `POST` to `api.anthropic.com/v1/messages` with `ANTHROPIC_API_KEY`, 25 second timeout.
  - `sync.js`: bidirectional sync against Supabase REST, table `app_sync`, app id `bffsa-bridge`, using `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.
  - `files-upload-init.js`, `files-get-url.js`, `files-delete.js`: signed Supabase Storage URLs, scopes `athlete` and `board`.
- AI models named in the file: `claude-haiku-4-5-20251001` (8 call sites) and `claude-opus-4-7` (4 call sites). No Sonnet model is referenced.
- Video: Jitsi (33 references). Transcription: Web Speech API (`SpeechRecognition`, 4 references).
- Hosting: Netlify, publish directory `.`, custom domain app.bffsa.org. Netlify site name and Supabase project id: (unverified, not in code).
- No Supabase URL or key in the HTML. All Supabase traffic goes through the functions.
- No Stripe integration in the app. The only Stripe reference is a seeded ledger row.

## State and persistence

- State object `D` persisted to `localStorage` key `bffsa-data` and synced through `/.netlify/functions/sync`.
- `saveAppData()` is debounced (168 references). `saveAppDataNow()` (3 references) writes immediately and pushes; use it for anything critical.
- `loadAppData()` (line 3262) restores a key list from the snapshot, then merges saved roster rows onto the hardcoded roster by `init`. Note: `roster` is in that key list even though the comment above it says roster is excluded (see CURRENT_STATE ISSUES).
- Schema migrations run off `D.config.schemaVersion` (line 3339 onward).
- Uploads: `fileToBase64()` (line 2023) stores bytes on the entry. Size caps found: 2MB, 3MB, 4MB depending on path.
- PIN: `D.config.adminPin` is set from the Security screen, with a fallback inside `checkPin()` (line 4692). Three staff records carry hardcoded PINs at lines 4301 to 4303.

## Themes and layout

- Two themes, `dark` and `light`, via `setTheme()` (line 4893) toggling `body.light`. Legacy names `ios` and `bffsa` map to `dark`. A help string at line 4228 still advertises four theme names; that copy is stale.
- Breakpoints: `@media (max-width: 767px)`, `(min-width: 768px)`, `(min-width: 1024px)`.

## Editing discipline

Never read the whole file into context. Filter out lines longer than 600 characters (base64 images) before grepping. `grep -n` to locate, `sed -n` for narrow ranges, targeted replacements, verify with `wc -l`. Use Node for scripted edits; Python is not installed on Dave's machine.

## Delivery

126 commits, every one "Update index.html" through the GitHub web editor, March 26 to June 12, 2026. The live file at app.bffsa.org is byte-identical to main as of September 12, 2026. From now on: local commits, Dave pushes.

## Verification

Script block count (1 inline plus 3 CDN), `node --check` on the extracted inline script, zero `type="date"`, zero `new Function` and `eval`, browser check at 390x844 and desktop across all three portals.
