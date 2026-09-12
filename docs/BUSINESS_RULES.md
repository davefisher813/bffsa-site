# BUSINESS RULES

## Nonprofit compliance (applies to any copy or feature)

- IRS earmarking: BFFSA retains full discretion over contributions. No donor-directed gifts to named individuals. Any donation or sponsorship flow added here must reflect this.
- Child safeguarding: anything publishing named minors requires Shawna's review first. The athlete portal and public portal must never expose athlete personal data publicly.
- Net event revenue is board-only. The public portal shows gross figures only.

## Portals

- Board/Admin behind a PIN. `D.config.adminPin` is set on the Security screen; `checkPin()` (line 4692) holds a fallback. Never log or display the PIN. Three staff records also carry hardcoded PINs (lines 4301 to 4303); see CURRENT_STATE ISSUES.
- Student Athlete portal shows only that athlete's data.
- Public portal is read-only. There are no Stripe donation links in the app today; donations happen on www.bffsa.org.

## Recruiting engine

- `calcCollegeFit()` (line 10467) is the single source of truth. Overall fit is driven by the worse of academic and athletic; financial is advisory. Score map: Conflict 10, Reach 30, Unknown 30, Fit 60, Safety 85. The 45/30/25 weighting described in earlier sessions is not in the code.
- User-facing tags: Reach, Target, Safety, Conflict, Pending. Confidence: High, Medium, Pending.
- Division tiers come from `divisionToTier()` (line 11261). There is no `getDivisionAcademicDefaults()` in the file.
- GPA comes from transcript extraction, never hardcoded. (unverified)
- Measurables are the source of truth for position health scans. (unverified)

## Data safety

- Critical writes go through `saveAppDataNow()` plus immediate sync.
- Never let empty saved state overwrite populated defaults.
- Never store secrets in the HTML. The client holds no Supabase key; `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ANTHROPIC_API_KEY` live in Netlify env and are read only by the functions.

## Facts that must stay correct in copy

- Main Board: Shawna Hamilton Doster (Chair), Byron Valverde (Vice Chair), Wei Chang (Treasurer), Linda Fisher (Secretary).
- Bridge Rising Leaders Scholarship: one-time $1,500. First recipient Jose Ulloa.
- Address: 54 Clifford Ave, Stamford, CT 06905.
- Staff seeded in code: Dave Fisher (Executive Director), Mike Skrapits and Kevin Valdovinos (Recruiting Coordinators).
