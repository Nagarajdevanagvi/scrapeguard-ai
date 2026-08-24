#!/usr/bin/env bash
# Seeds the ScrapeGuard AI backend with two REAL Bright Data runs so the
# self-healing story can be demonstrated live without needing Bright Data
# CLI access on the demo machine:
#
#   1. examples/cutshort-live-run.json    - the first real run of collector
#      c_mt5vcktj27revhtp8n. 271 real job records; the "company" field was
#      only ~72% complete, so this fails our data contract and opens an
#      incident.
#   2. examples/cutshort-healed-run.json  - a re-run of the SAME collector
#      after Bright Data's AI healed the "company" extraction. This passes
#      the contract and should auto-resolve the incident.
#
# Usage:
#   ./scripts/seed_demo.sh
#   SCRAPEGUARD_API_URL=http://localhost:8000 ./scripts/seed_demo.sh
#
# The script pauses between steps so you can narrate over the UI. Press
# Enter at each pause to continue.

set -euo pipefail

API="${SCRAPEGUARD_API_URL:-http://localhost:8000}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pause() {
  echo
  echo "-> $1"
  read -rp "   Press Enter to continue... " _ || true
}

wait_for_backend() {
  echo "Waiting for backend at $API ..."
  for _ in $(seq 1 30); do
    if curl -sf "$API/api/health" > /dev/null 2>&1; then
      echo "Backend is up."
      return 0
    fi
    sleep 1
  done
  echo "Backend did not respond at $API/api/health." >&2
  echo "Start it first: .venv/bin/uvicorn backend.app.main:app --reload --port 8000" >&2
  exit 1
}

wrap_records() {
  python3 -c "
import json, sys
records = json.load(open(sys.argv[1]))
print(json.dumps({'records': records}))
" "$1"
}

get_or_create_source() {
  local collector_id
  collector_id=$(python3 -c "import json;print(json.load(open('$ROOT/examples/cutshort-source.json'))['collector_id'])")

  local existing
  existing=$(curl -sS "$API/api/sources" | python3 -c "
import json, sys
collector_id = '$collector_id'
sources = json.load(sys.stdin)
match = next((s for s in sources if s.get('collector_id') == collector_id), None)
print(match['id'] if match else '')
")
  if [ -n "$existing" ]; then
    echo "Reusing existing source: $existing" >&2
    echo "$existing"
    return 0
  fi

  local created
  created=$(curl -sS -X POST "$API/api/sources" -H 'Content-Type: application/json' --data @"$ROOT/examples/cutshort-source.json")
  python3 -c "import json,sys;print(json.load(sys.stdin)['id'])" <<< "$created"
}

wait_for_backend

echo "Registering the Cutshort source (collector c_mt5vcktj27revhtp8n)..."
SOURCE_ID=$(get_or_create_source)
echo "Source ID: $SOURCE_ID"

pause "Open http://localhost:3000 (Dashboard). It should be empty or healthy so far — nothing ingested yet."

echo
echo "=== Step 1: ingesting the first real Bright Data run (271 real job records) ==="
wrap_records "$ROOT/examples/cutshort-live-run.json" > /tmp/scrapeguard-run1.json
curl -sS -X POST "$API/api/sources/$SOURCE_ID/ingest" -H 'Content-Type: application/json' \
  --data @/tmp/scrapeguard-run1.json | python3 -m json.tool

pause "Open http://localhost:3000/incidents — an incident should now be open (company field completeness below contract threshold). Click it to show the root cause and affected fields."

echo
echo "=== Step 2: ingesting the healed re-run (same collector, after Bright Data AI heal + approval) ==="
wrap_records "$ROOT/examples/cutshort-healed-run.json" > /tmp/scrapeguard-run2.json
curl -sS -X POST "$API/api/sources/$SOURCE_ID/ingest" -H 'Content-Type: application/json' \
  --data @/tmp/scrapeguard-run2.json | python3 -m json.tool

pause "Refresh http://localhost:3000/incidents — the incident should now show RESOLVED with a detect -> recover timeline. Check http://localhost:3000/jobs to browse the real extracted job data."

echo
echo "Demo seed complete."
