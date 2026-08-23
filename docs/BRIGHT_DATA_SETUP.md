# Bright Data collector setup

ScrapeGuard AI monitors the public Cutshort job-listing page at
`https://cutshort.io/jobs`. Do not include login-only pages or candidate data.

## Authenticate

Run this from a terminal with browser access. OAuth keeps the account token out
of the repository and out of `.env` files.

```bash
npx -p @brightdata/cli bdata login
```

## Create the collector

The collector created for this project is `c_mt5vcktj27revhtp8n`. Its public
configuration is tracked in `scraper/collector.json`; the Collector ID is an
identifier, not an account credential.

```bash
npx -p @brightdata/cli bdata scraper create https://cutshort.io/jobs \
  "Extract publicly visible job cards into JSON. Return one record per job with: title, company, location, description, skills as an array when visible, salary when visible, employment_type when visible, and source_url as the absolute public job URL. Do not collect contact details, application data, or data behind sign-in. Preserve these field names exactly."
```

## Prove the collector works

```bash
npx -p @brightdata/cli bdata scraper run c_mt5vcktj27revhtp8n https://cutshort.io/jobs --pretty
```

Save the command output as `examples/bright-data-run.json` locally (it is
ignored by Git if it contains account/run metadata). The same collector ID is
used during healing; ScrapeGuard never rebuilds it.

## Demonstrate recovery

When a contract violation is detected, ScrapeGuard calls this operation through
its API. You can also demonstrate it directly:

```bash
npx -p @brightdata/cli bdata scraper heal c_mt5vcktj27revhtp8n \
  "The data contract failed: the company field is missing or empty in a meaningful share of job records. Restore the existing output schema: title, company, location, description, skills, salary, employment_type, source_url."
npx -p @brightdata/cli bdata scraper approve c_mt5vcktj27revhtp8n --url https://cutshort.io/jobs --pretty
```

Then re-run the exact same Collector ID and ingest the output. The incident is
resolved only when the contract passes.

## Collector history

The original collector, `c_mt5gcvr895y7zea7e`, was retired after an earlier
heal/refactor job never completed cleanly. Its underlying dataset became
unlinked on Bright Data's side (the dashboard showed `dataset_id=undefined`,
"No inputs added yet", and "Source: Required" stuck loading), which made every
run and heal attempt fail regardless of the CLI or account used. A fresh
collector (`c_mt5vcktj27revhtp8n`) was created with the identical prompt and
target URL, and produced a real 271-record run on the first try. If a
collector ever enters this state again, recreating it is faster than trying
to repair Bright Data's internal dataset linkage.

That first run had one real, unforced gap: the `company` field was only
~72% complete (below our 90% contract threshold), which correctly triggered
an incident. We ran `bdata scraper heal` targeting that field, and
`bdata scraper approve` — both completed successfully, and the heal's own
preview showed `company` correctly populated. The verification step — a full
batch re-run of the healed collector to confirm the fix across all records —
hit an intermittent `fetch failed` error in the CLI's batch-status polling
2 of 4 times we tried it (confirmed unrelated to collector health: a raw
`curl`/Node `fetch` loop against the same endpoint succeeded 15/15 times).
If you hit this, just retry `bdata scraper run` — it isn't a sign of a
broken collector.
