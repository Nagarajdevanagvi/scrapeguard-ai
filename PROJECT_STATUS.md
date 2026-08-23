# ScrapeGuard AI — Project Status & Handoff

**Last updated:** 2026-08-23 (final submission day)
**Current branch:** `develop`
**Remote repository:** `https://github.com/Nagarajdevanagvi/scrapeguard-ai`

For setup, architecture, and demo instructions, see [`README.md`](README.md)
and [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md). This file is the engineering
log — what's actually done, what broke, and what's still open.

## What's actually done (verified, not assumed)

- **Backend** ([`backend/app/main.py`](backend/app/main.py)): FastAPI +
  SQLite. Source registration, ingestion, field normalization, contract
  validation, health scoring, incident creation, **automatic incident
  resolution on a subsequent passing run** (this was the key missing piece —
  originally incidents never closed themselves), and a recovery timeline
  (`detect` → `heal` → `recover`) persisted per incident. Verified live end
  to end with `curl`: bad data opens an incident, a later good run resolves
  it and the dashboard flips to healthy automatically.
- **Frontend**: Dashboard, Scraper Health, Job Intelligence, and Incidents
  pages fetch live from the backend (with mock-data fallback only if the
  backend is unreachable). Incidents page KPI cards (open count, resolved
  today, critical count, avg recovery time) were hardcoded literal text
  before today — now computed from live incident data. Verified visually in
  a real browser, not just via `tsc`.
- **Self-Healing Center page**: still a scripted interactive simulator, not
  wired to live incidents. Left as-is — it's a reasonable "click to watch a
  simulated recovery" demo piece regardless, and wiring it up would need a
  data shape (multi-stage pipeline state, live logs) the backend doesn't
  produce yet.
- **Bright Data**: the original collector (`c_mt5gcvr895y7zea7e`) is
  **retired** — see "Collector incident" below. Current collector:
  `c_mt5vcktj27revhtp8n`. Produced a real 271-record run
  ([`examples/cutshort-live-run.json`](examples/cutshort-live-run.json)),
  which correctly failed our data contract (company field ~72% complete).
  We ran a real `bdata scraper heal` + `approve` cycle against it (both
  succeeded; the heal's preview showed company correctly populated), but
  the full batch re-run to verify the fix across all 271 records hit a
  flaky `fetch failed` error in the CLI's polling and didn't finish before
  we had to move on. [`examples/cutshort-healed-run.json`](examples/cutshort-healed-run.json)
  is a real, passing 196-record subset of the original run (every required
  field present) used to demo the resolution flow instead.

## Collector incident (why the Collector ID changed)

The original collector (`c_mt5gcvr895y7zea7e`) got stuck mid-heal in an
earlier session (HTTP 409, "another refactor job still in progress"). On
inspection via the Bright Data dashboard, the collector was left in a broken
state: "No inputs added yet," "Source: Required" stuck on Loading forever,
"No scraping activity has been logged yet" despite runs actually triggering,
and — the clearest signal — the dashboard's own generated API example
contained `dataset_id=undefined`. The collector's dataset was unlinked on
Bright Data's backend; this wasn't fixable from the client side (CLI or
dashboard). A fresh collector with the identical prompt and target URL
(`c_mt5vcktj27revhtp8n`) was created instead and worked immediately. Full
details in [`docs/BRIGHT_DATA_SETUP.md`](docs/BRIGHT_DATA_SETUP.md).

Separately: the Bright Data CLI's batch-mode polling (`bdata scraper run` /
`heal` against a large page like `cutshort.io/jobs`) intermittently throws
`fetch failed` a few polls in — happened 2 of 4 times today, unrelated to
collector health (confirmed via direct `curl`/Node `fetch` loops against the
same endpoint succeeding reliably). Just retry the command if it happens;
it's a CLI/network flakiness issue, not a sign anything is broken.

## Not yet complete

- PostgreSQL, auth, scheduling, queues, notifications, multi-tenancy —
  intentionally out of scope for the deadline MVP (see README "Current
  scope"). Post-hackathon roadmap item.
- No automated tests yet.
- Self-Healing Center page not wired to live data (see above).
- Work is committed locally on `develop` but not yet pushed to GitHub as of
  this writing.

## Remaining priorities before submission

1. Push to GitHub (`develop` branch).
2. Teammate clones fresh, runs `scripts/seed_demo.sh`, records the demo using
   [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).
3. Submit repository + demo video.
