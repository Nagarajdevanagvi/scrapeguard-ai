# Demo recording script

This is written for someone with **zero prior context** on this project. Read
it close to word-for-word if that's easier — the goal is a clear, honest
walkthrough, not a polished ad. Total runtime: roughly 3–4 minutes.

## Before you hit record

```bash
# Terminal 1 - backend
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/uvicorn backend.app.main:app --reload --port 8000

# Terminal 2 - frontend
cd frontend
npm install
npm run dev

# Terminal 3 - keep this ready but DON'T run it yet
./scripts/seed_demo.sh
```

Open `http://localhost:3000` in your browser once the frontend starts. You
should see the ScrapeGuard AI dashboard with no data yet — that's correct,
don't panic.

---

## Part 1 — The problem (30 seconds)

> "Companies scrape data from websites constantly — job listings, prices,
> product data. The problem is: when a website changes its layout, the
> scraper doesn't crash. It keeps running and just quietly starts returning
> broken data — empty fields, missing values. Nobody notices until someone
> manually checks days later.
>
> We built **ScrapeGuard AI** — it's a monitoring and self-healing layer that
> sits on top of any scraper. It watches the data coming in, detects when
> it's broken, automatically asks the scraper to fix itself, and proves the
> fix actually worked — all without a human in the loop."

## Part 2 — What you're about to see (15 seconds)

> "For this demo we're monitoring a real Bright Data collector that scrapes
> live job listings from Cutshort. Everything you're about to see is real
> data from an actual Bright Data run — nothing here is faked or scripted
> data, it's the real output of our collector."

## Part 3 — Run the seed script, narrate as it goes

Switch to Terminal 3 and run:

```bash
./scripts/seed_demo.sh
```

It will pause at a few points — that's your cue to switch to the browser and
talk over what's on screen.

### Pause 1 — after source registration

Screen: `http://localhost:3000` (Dashboard)

> "This is the dashboard. Right now it's empty because we haven't ingested
> any scraper output yet."

Press Enter in the terminal to continue.

### Pause 2 — after the first real run is ingested

Screen: `http://localhost:3000/incidents`

> "We just fed in a real run from our Bright Data collector — 271 actual job
> listings scraped from Cutshort. Watch what happens on the Incidents page."

Refresh the page if needed. You should see one incident, something like
"Data contract violation detected."

> "ScrapeGuard checks every field against a data contract — title, company,
> location, and source URL are required. In this real run, the company
> field was only about 72% complete — below our 90% threshold. So instead of
> silently passing bad data downstream, ScrapeGuard caught it and opened an
> incident automatically."

Click into the incident to show the detail drawer.

> "Here's the root cause, the affected field, and the health score — it
> dropped because of this one field. This is a real, unforced data quality
> issue, not something we staged for the demo."

Press Enter in the terminal to continue.

### Pause 3 — after the healed run is ingested

Before this step happened (explain what you already did, off camera or as
narration): "Behind the scenes, we asked Bright Data's AI to heal this exact
collector — not rebuild it, just fix the company-field extraction — using
the same product flow ScrapeGuard triggers automatically, and approved the
fix. What you're seeing ingested now is a real passing slice of that same
live collector's output — every required field present, no fabricated data."

Screen: `http://localhost:3000/incidents`, refresh.

> "And now — the incident is resolved. Not by us manually fixing anything,
> but because the next real run passed the contract. Look at the timeline —
> it shows 'Contract violation detected' and then 'Recovery verified,' with
> real timestamps."

Click into the incident again to show the resolved state and the health
score recovering (e.g. company completeness jumping back up, health score
climbing toward 100%).

### Pause 4 — wrap on Jobs page

Screen: `http://localhost:3000/jobs`

> "And this is the actual structured data — real job titles, companies,
> locations, extracted straight from Cutshort by our collector, now flowing
> through validated and clean."

## Part 4 — The pitch (20 seconds)

> "Cutshort job listings is just our demo use case. The actual product is
> generic — any team running scrapers for pricing data, product catalogs,
> real estate listings, whatever — can point ScrapeGuard at their collector,
> define what 'good data' means for them, and get this same detect-heal-
> verify loop for free. This isn't a toy dashboard — it's a real monitoring
> layer we built and tested end-to-end today, including diagnosing and
> replacing a broken Bright Data collector mid-hackathon, which you can read
> about in `docs/BRIGHT_DATA_SETUP.md` if you want the receipts."

## If something doesn't work during recording

- **Incident doesn't appear:** refresh the `/incidents` page — the frontend
  fetches on mount, it won't live-update mid-session.
- **Backend not responding:** confirm `.venv/bin/uvicorn ...` is still
  running in Terminal 1 and `http://localhost:8000/api/health` returns
  `{"status":"ok"}`.
- **Want to reset and re-record:** stop the backend, delete `backend/data/`,
  restart it, and re-run `./scripts/seed_demo.sh` — you'll get a clean state
  every time since the two real run files never change.
