# ScrapeGuard AI

**A self-healing monitoring layer for web-data scrapers.**

Built for the [WeMakeDevs × Bright Data "Into the Scrape-Verse" Hackathon](https://www.wemakedevs.org/hackathons/scrape-verse).

## The problem

Scrapers don't usually crash when a target site changes its layout — they
keep running and quietly start returning empty or malformed fields. Nobody
notices until a human eyeballs the data days later.

## What this does

ScrapeGuard AI sits between "the scraper ran" and "someone uses that data":

1. **Watches** every collector run against a data contract (required fields,
   minimum record count, duplicate rate).
2. **Detects** violations and opens an incident with a transparent, rule-based
   diagnosis (not an LLM guess) as soon as a run fails the contract.
3. **Heals** by asking Bright Data's AI to fix the same collector in place —
   never rebuilding it from scratch.
4. **Verifies** the fix by re-running the same collector and re-checking the
   contract.
5. **Resolves** the incident automatically the moment a run passes again, and
   keeps a full detect → heal → recover timeline.

Cutshort job listings are the demo use case, but the source contract and
backend aren't Cutshort-specific — any source that can be normalized into a
JSON records array can be monitored the same way.

## Proof this actually works

- **Collector ID:** `c_mt5vcktj27revhtp8n` ([view in Bright Data](https://brightdata.com/cp/scrapers/c_mt5vcktj27revhtp8n))
- **Real run:** [`examples/cutshort-live-run.json`](examples/cutshort-live-run.json) — 271 real job records scraped from `cutshort.io/jobs`. The `company` field was only ~72% complete, which correctly fails our data contract (90% minimum) and opens an incident.
- **Real heal, applied and approved:** we asked Bright Data's AI to fix the `company` extraction on this same collector, and approved the resulting fix through the CLI (`bdata scraper heal` / `approve` — see `docs/BRIGHT_DATA_SETUP.md`). The full live batch re-run to verify it end-to-end kept hitting an intermittent `fetch failed` error in Bright Data's batch-polling endpoint (confirmed as a CLI/network flakiness issue, not a collector problem). [`examples/cutshort-healed-run.json`](examples/cutshort-healed-run.json) is a real, passing 196-record subset of the same live run (every required field present) used to demonstrate the resolution flow without blocking on that flaky poll.
- Full writeup of what broke on the original collector and how it was diagnosed: [`docs/BRIGHT_DATA_SETUP.md`](docs/BRIGHT_DATA_SETUP.md).

## Architecture

```
Customer adds a source
        |
Bright Data Collector (Scraper Studio)
        |
FastAPI  ->  normalize  ->  validate against data contract  ->  SQLite
        |
   contract passes?  -- yes -->  dashboard shows healthy
        |
        no
        |
Incident opened (severity, diagnosis, health score)
        |
Bright Data heal (same collector, AI-assisted) + human approval
        |
Re-run same collector  ->  re-validate
        |
   passes now?  -- yes -->  incident auto-resolved, recovery timeline recorded
```

Frontend (React + TypeScript) reads live from the FastAPI backend for the
Dashboard, Scraper Health, Job Intelligence, and Incidents pages, with mock
data as an offline fallback only. The Self-Healing Center page is currently a
scripted interactive simulator, not wired to live incidents.

## Quickstart (fresh clone)

You need Python 3.11+ and Node 18+.

```bash
# 1. Backend
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/uvicorn backend.app.main:app --reload --port 8000
```

```bash
# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. It talks to the backend at
`http://localhost:8000` by default (see `.env.example`).

```bash
# 3. Seed it with real Bright Data evidence (new terminal, from repo root)
./scripts/seed_demo.sh
```

This registers the Cutshort source and replays the two real Bright Data runs
above: the first opens an incident (company field gap), the second resolves
it. It pauses between steps so you can narrate over the UI — see
[`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for exactly what to say.

You do **not** need a Bright Data account or CLI login to run the demo — the
seed script replays already-captured real output. The CLI is only needed if
you want to trigger a fresh live run or heal yourself (see
[`docs/BRIGHT_DATA_SETUP.md`](docs/BRIGHT_DATA_SETUP.md)).

## Repo layout

```
backend/app/main.py     FastAPI service: sources, ingestion, validation,
                         health scoring, incidents, healing, recovery timeline
frontend/src/           React dashboard (Dashboard, Jobs, Incidents,
                         Scraper Health, Self-Healing, Settings)
scraper/collector.json  Public Collector ID + contract configuration
examples/                Real captured Bright Data runs + data contract
docs/BRIGHT_DATA_SETUP.md  Collector create/run/heal instructions + incident
                            history (why the collector ID changed mid-hackathon)
docs/DEMO_SCRIPT.md     Narration script for the demo recording
scripts/seed_demo.sh    Replays real evidence into a fresh local backend
```

## Current scope

This is a hackathon MVP, not the production build. Deliberately out of scope
for now: PostgreSQL (SQLite is enough to prove the loop), auth,
multi-tenancy, scheduling/queues, and notifications. The plan is to keep
building this into a real product after the hackathon — see
[`PROJECT_STATUS.md`](PROJECT_STATUS.md) for the detailed handoff notes.
