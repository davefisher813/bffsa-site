# PRODUCT

## What it is

The BFFSA operating platform: one installable PWA that runs the nonprofit's board operations, athlete roster and college recruiting engine, donor management, finances, events, and reports, plus a student athlete portal and a public portal.

## Who it serves

- Board/Admin portal (PIN protected): Dave and the board (Shawna Hamilton Doster, Chair; Byron Valverde, Vice Chair; Wei Chang, Treasurer; Linda Fisher, Secretary) plus College Advisory Board members and staff (Mike Skrapits, Kevin Valdovinos).
- Student Athlete portal: BFFSA athletes tracking their own recruiting fit, documents, and measurables.
- Public portal: donors and community, read-only.

## Main flows

1. Board: meetings with Jitsi video and Web Speech transcription; income and expense ledger; calendar and events; goals; tasks; reports; notifications; settings; PIN change. Home tiles are configurable (docs, messages, meetings, calendar, files, dev board, tasks, roster, recruiting, goals, accounts, donors, events).
2. Document Intelligence: upload a roster, donor list, transcript, award letter, xlsx, docx, or csv and the relevant section populates through the `claude` function (Haiku 4.5 for general work, Opus 4.7 for extraction and comparison).
3. Athlete roster and recruiting engine: `calcCollegeFit()` combines academic, athletic, and financial fit into one score and tag (Reach, Target, Safety, Conflict, Pending) with per-axis confidence; benchmarks by sport and division tier; financial fit from award letters; GPA from transcript extraction.
4. Files: uploads stored in Supabase Storage through signed URLs, scoped to athlete or board.
5. Supabase bidirectional sync of the whole state object.

## Intended experience

Board-ready, calm, serious. Reads well on iPhone Safari first, then laptop. Nothing is lost when iOS suspends the tab.
