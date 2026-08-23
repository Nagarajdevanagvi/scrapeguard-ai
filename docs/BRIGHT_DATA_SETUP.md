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

The collector created for this project is `c_mt5gcvr895y7zea7e`. Its public
configuration is tracked in `scraper/collector.json`; the Collector ID is an
identifier, not an account credential.

```bash
npx -p @brightdata/cli bdata scraper create https://cutshort.io/jobs \
  "Extract publicly visible job cards into JSON. Return one record per job with: title, company, location, description, skills as an array when visible, salary when visible, employment_type when visible, and source_url as the absolute public job URL. Do not collect contact details, application data, or data behind sign-in. Preserve these field names exactly."
```

## Prove the collector works

```bash
npx -p @brightdata/cli bdata scraper run c_mt5gcvr895y7zea7e https://cutshort.io/jobs --pretty
```

Save the command output as `examples/bright-data-run.json` locally (it is
ignored by Git if it contains account/run metadata). The same collector ID is
used during healing; ScrapeGuard never rebuilds it.

## Demonstrate recovery

When a contract violation is detected, ScrapeGuard calls this operation through
its API. You can also demonstrate it directly:

```bash
npx -p @brightdata/cli bdata scraper heal c_REPLACE_ME \
  "The data contract failed: the location field is missing or empty in most job records. Restore the existing output schema: title, company, location, description, skills, salary, employment_type, source_url."
```

Then re-run the exact same Collector ID and ingest the output. The incident is
resolved only when the contract passes.
