# Daily review schedule

The web workspace now has a private `/review` route, linked from the sidebar, daily practice and question practice. This feature is local until the branch is published.

## Behavior

- Flashcard grades and checked quiz answers create `practice/review/<card-id>` records in the existing account-aware study store.
- Successful recall when due advances through 1, 3, 7, 14, 30 and 60 days. Later successful reviews remain 60 days apart. A miss resets the next review to tomorrow.
- Early successful answers do not increase spacing or move the existing due date.
- Existing answered practice sessions seed missing schedules on demand. Unknown cards are ignored, and explicit review tombstones are not resurrected by old session history.
- Open notebook mistakes retain the existing 1, 3 and 7-day retry logic. The queue does not duplicate a question already represented by an open mistake. Reviewing such a mistake updates both its notebook record and its question schedule.
- Oldest due items appear first; a “Needs practice” confidence rating breaks ties. Confidence is not treated as measured mastery.
- A session contains at most 10 due items. Answers start concealed, skip leaves the due date unchanged, future items cannot be graded, and the next prompt receives keyboard focus.
- Guest data stays in the browser and joins the existing explicit local-import flow after sign-in. Account records use the existing sync engine and database key namespace; no database migration is required.
- Schedule records are validated during backup import/export and restored by the web backup flow. Account changes reset the visible session and stale account actions are rejected.
- The review route is excluded from the public sitemap and carries noindex, like other personal study tools.

This is a transparent, fixed-interval recall schedule, not FSRS, a prediction of retention or a guarantee of mastery. The native Android UI has not been extended with a review screen in this change; the scheduling and backup formats are in the shared learning package.

## Validation

Shared tests cover interval progression, repeated early answers, reset after a miss, malformed records, legacy-session discovery, notebook deduplication, confidence tie breaking and future-item protection. Web tests cover keyboard activation/focus, hidden answers, saved due dates, notebook preservation, backup restore/tombstones, account separation and UI SDK agent discovery.

Production output is checked for the private route’s noindex directive and sitemap exclusion. The existing development server returned HTTP 200 for `/review`.

## Production performance check, 23 November 2026

Five independent compressed HTTPS requests were made per URL from this machine, with a new connection each time. All returned HTTP 200. Full measurements are in [the JSON report](performance/2026-11-23-network.json).

| Page              | Median first byte | Median full HTML transfer | Compressed HTML |
| ----------------- | ----------------: | ------------------------: | --------------: |
| Homepage          |          247.4 ms |                  249.7 ms |    12,883 bytes |
| Event-loop lesson |          228.0 ms |                  231.6 ms |    13,737 bytes |
| Start here        |          236.8 ms |                  238.7 ms |     9,892 bytes |

These are network-response measurements for the currently deployed site, not measurements of JavaScript execution, visual stability, mobile rendering, LCP, INP or overall page readiness. The new review feature is not deployed by this check.

The shared browser tool still reports local browser use disabled in this session. The user chose to keep using that browser rather than run an isolated Chromium/Lighthouse alternative. Consequently, real phone/tablet viewport screenshots and real-browser keyboard checks remain unverified. Automated keyboard tests passed, but are not a substitute for those checks. The earlier public PageSpeed API attempt returned HTTP 429 / quota exhausted; no Lighthouse score or Core Web Vitals result is claimed.
