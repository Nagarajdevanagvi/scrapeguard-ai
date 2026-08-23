"""ScrapeGuard AI: API for source contracts, scraper runs, and recovery evidence.

The service intentionally keeps the collector boundary small: Bright Data owns
extraction, while ScrapeGuard persists the result and verifies the data
contract before downstream customers can consume it.
"""

from __future__ import annotations

import json
import os
import sqlite3
import subprocess
import uuid
from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = Path(os.getenv("SCRAPEGUARD_DATA_DIR", ROOT / "data"))
DB_PATH = DATA_DIR / "scrapeguard.db"
DEFAULT_REQUIRED_FIELDS = ["title", "company", "location", "source_url"]


def now() -> str:
    return datetime.now(UTC).isoformat()


def time_ago(timestamp: str) -> str:
    then = datetime.fromisoformat(timestamp)
    seconds = max(0, (datetime.now(UTC) - then).total_seconds())
    if seconds < 60:
        return "just now"
    minutes = int(seconds // 60)
    if minutes < 60:
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    hours = int(minutes // 60)
    if hours < 24:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = int(hours // 24)
    return f"{days} day{'s' if days != 1 else ''} ago"


def human_time(timestamp: str) -> str:
    return datetime.fromisoformat(timestamp).strftime("%b %d, %H:%M UTC")


@contextmanager
def db() -> Any:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def init_db() -> None:
    with db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS sources (
              id TEXT PRIMARY KEY, name TEXT NOT NULL, target_url TEXT NOT NULL,
              collector_id TEXT UNIQUE, required_fields TEXT NOT NULL,
              min_records INTEGER NOT NULL DEFAULT 3, alert_threshold INTEGER NOT NULL DEFAULT 80,
              status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS runs (
              id TEXT PRIMARY KEY, source_id TEXT NOT NULL, started_at TEXT NOT NULL,
              completed_at TEXT NOT NULL, status TEXT NOT NULL, record_count INTEGER NOT NULL,
              health_score REAL NOT NULL, validation TEXT NOT NULL, raw_payload TEXT NOT NULL,
              FOREIGN KEY(source_id) REFERENCES sources(id)
            );
            CREATE TABLE IF NOT EXISTS jobs (
              id TEXT PRIMARY KEY, source_id TEXT NOT NULL, run_id TEXT NOT NULL,
              title TEXT, company TEXT, location TEXT, description TEXT, skills TEXT,
              salary TEXT, employment_type TEXT, source_url TEXT, raw_record TEXT NOT NULL,
              scraped_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS incidents (
              id TEXT PRIMARY KEY, source_id TEXT NOT NULL, run_id TEXT NOT NULL,
              status TEXT NOT NULL, severity TEXT NOT NULL, title TEXT NOT NULL,
              diagnosis TEXT NOT NULL, health_before REAL, health_during REAL, health_after REAL,
              created_at TEXT NOT NULL, resolved_at TEXT
            );
            CREATE TABLE IF NOT EXISTS recovery_events (
              id TEXT PRIMARY KEY, incident_id TEXT NOT NULL, stage TEXT NOT NULL,
              message TEXT NOT NULL, created_at TEXT NOT NULL
            );
            """
        )


class SourceCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    target_url: HttpUrl
    collector_id: str | None = Field(default=None, pattern=r"^c_[A-Za-z0-9_-]+$")
    required_fields: list[str] = Field(default_factory=lambda: DEFAULT_REQUIRED_FIELDS.copy())
    min_records: int = Field(default=3, ge=1, le=100000)
    alert_threshold: int = Field(default=80, ge=1, le=100)


class IngestPayload(BaseModel):
    records: list[dict[str, Any]]
    raw_payload: Any | None = None


class BrightDataCommand(BaseModel):
    """Explicitly opt in to shelling out to the locally authenticated bdata CLI."""
    target_url: HttpUrl | None = None
    failure_description: str | None = Field(default=None, max_length=1000)


def parse_bright_data_json(output: str) -> list[dict[str, Any]]:
    """Accept either a JSON array or an object containing a records/data array."""
    try:
        parsed = json.loads(output)
    except json.JSONDecodeError as exc:
        raise HTTPException(502, "Bright Data run did not return parseable JSON") from exc
    if isinstance(parsed, list) and all(isinstance(item, dict) for item in parsed):
        return parsed
    if isinstance(parsed, dict):
        for key in ("records", "data", "results"):
            value = parsed.get(key)
            if isinstance(value, list) and all(isinstance(item, dict) for item in value):
                return value
    raise HTTPException(502, "Bright Data JSON did not contain a list of records")


def normalize(record: dict[str, Any]) -> dict[str, Any]:
    aliases = {
        "title": ("title", "job_title", "position", "role"),
        "company": ("company", "company_name", "employer"),
        "location": ("location", "job_location"),
        "description": ("description", "job_description", "summary"),
        "skills": ("skills", "technologies", "tags"),
        "salary": ("salary", "compensation"),
        "employment_type": ("employment_type", "job_type", "type"),
        "source_url": ("source_url", "url", "job_url", "link"),
    }
    output: dict[str, Any] = {}
    for canonical, options in aliases.items():
        value = next((record[key] for key in options if record.get(key) not in (None, "", [])), None)
        if canonical == "skills" and isinstance(value, str):
            value = [skill.strip() for skill in value.split(",") if skill.strip()]
        output[canonical] = value
    return output


def validate(records: list[dict[str, Any]], required_fields: list[str], min_records: int) -> dict[str, Any]:
    normalized = [normalize(record) for record in records]
    field_quality = {
        field: round(sum(bool(row.get(field)) for row in normalized) / len(normalized) * 100, 1) if normalized else 0
        for field in required_fields
    }
    record_keys = ["|".join(str(row.get(key) or "").lower().strip() for key in ("title", "company", "source_url")) for row in normalized]
    duplicates = len(record_keys) - len(set(record_keys)) if record_keys else 0
    duplicate_rate = duplicates / len(record_keys) if record_keys else 1
    completeness = sum(field_quality.values()) / (100 * len(required_fields)) if required_fields else 1
    count_score = min(1, len(normalized) / min_records)
    health = round(max(0, 100 * (0.55 * completeness + 0.35 * count_score + 0.10 * (1 - duplicate_rate))), 1)
    issues: list[str] = []
    if len(normalized) < min_records:
        issues.append(f"Only {len(normalized)} records returned; contract requires at least {min_records}.")
    for field, quality in field_quality.items():
        if quality < 90:
            issues.append(f"{field} completeness is {quality}% (minimum 90%).")
    if duplicate_rate > 0.10:
        issues.append(f"Duplicate rate is {round(duplicate_rate * 100, 1)}% (maximum 10%).")
    return {
        "passed": not issues,
        "health_score": health,
        "record_count": len(normalized),
        "field_quality": field_quality,
        "duplicate_rate": round(duplicate_rate * 100, 1),
        "issues": issues,
        "normalized": normalized,
    }


def source_or_404(source_id: str) -> sqlite3.Row:
    with db() as connection:
        source = connection.execute("SELECT * FROM sources WHERE id = ?", (source_id,)).fetchone()
    if not source:
        raise HTTPException(404, "Source not found")
    return source


def row_dict(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


app = FastAPI(title="ScrapeGuard AI API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "scrapeguard-api", "time": now()}


@app.post("/api/sources", status_code=201)
def create_source(payload: SourceCreate) -> dict[str, Any]:
    source_id = f"src_{uuid.uuid4().hex[:10]}"
    timestamp = now()
    source = payload.model_dump(mode="json")
    with db() as connection:
        connection.execute(
            "INSERT INTO sources VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
            (source_id, source["name"], source["target_url"], source["collector_id"], json.dumps(source["required_fields"]), source["min_records"], source["alert_threshold"], timestamp, timestamp),
        )
    return {"id": source_id, **source, "status": "pending", "created_at": timestamp}


@app.get("/api/sources")
def list_sources() -> list[dict[str, Any]]:
    with db() as connection:
        rows = connection.execute("SELECT * FROM sources ORDER BY created_at DESC").fetchall()
    return [{**row_dict(row), "required_fields": json.loads(row["required_fields"])} for row in rows]


@app.post("/api/sources/{source_id}/ingest", status_code=201)
def ingest(source_id: str, payload: IngestPayload) -> dict[str, Any]:
    source = source_or_404(source_id)
    contract = validate(payload.records, json.loads(source["required_fields"]), source["min_records"])
    run_id = f"run_{uuid.uuid4().hex[:12]}"
    status = "healthy" if contract["passed"] else "degraded"
    completed_at = now()
    with db() as connection:
        previous = connection.execute("SELECT health_score FROM runs WHERE source_id = ? ORDER BY completed_at DESC LIMIT 1", (source_id,)).fetchone()
        connection.execute("INSERT INTO runs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (run_id, source_id, completed_at, completed_at, status, contract["record_count"], contract["health_score"], json.dumps({key: value for key, value in contract.items() if key != "normalized"}), json.dumps(payload.raw_payload if payload.raw_payload is not None else payload.records)))
        for raw, job in zip(payload.records, contract["normalized"]):
            connection.execute("INSERT INTO jobs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (f"job_{uuid.uuid4().hex[:12]}", source_id, run_id, job["title"], job["company"], job["location"], job["description"], json.dumps(job["skills"] or []), job["salary"], job["employment_type"], job["source_url"], json.dumps(raw), completed_at))
        connection.execute("UPDATE sources SET status = ?, updated_at = ? WHERE id = ?", (status, completed_at, source_id))
        incident = None
        resolved_incidents: list[str] = []
        if not contract["passed"]:
            incident_id = f"inc_{uuid.uuid4().hex[:10]}"
            diagnosis = " ".join(contract["issues"])
            severity = "critical" if contract["health_score"] < source["alert_threshold"] else "warning"
            connection.execute(
                "INSERT INTO incidents VALUES (?, ?, ?, 'open', ?, ?, ?, ?, ?, NULL, ?, NULL)",
                (incident_id, source_id, run_id, severity, "Data contract violation detected", diagnosis, previous["health_score"] if previous else None, contract["health_score"], completed_at),
            )
            connection.execute("INSERT INTO recovery_events VALUES (?, ?, 'detect', ?, ?)", (f"evt_{uuid.uuid4().hex[:10]}", incident_id, diagnosis, completed_at))
            incident = {"id": incident_id, "severity": severity, "diagnosis": diagnosis}
        else:
            # A healthy run closes the loop: any incident still open/healing for this
            # source is the one this run just proved recovered from.
            open_incidents = connection.execute(
                "SELECT id FROM incidents WHERE source_id = ? AND status IN ('open', 'healing')", (source_id,)
            ).fetchall()
            for row in open_incidents:
                connection.execute(
                    "UPDATE incidents SET status = 'resolved', health_after = ?, resolved_at = ? WHERE id = ?",
                    (contract["health_score"], completed_at, row["id"]),
                )
                connection.execute(
                    "INSERT INTO recovery_events VALUES (?, ?, 'recover', ?, ?)",
                    (f"evt_{uuid.uuid4().hex[:10]}", row["id"], f"Run {run_id} passed the data contract (health {contract['health_score']}). Incident resolved.", completed_at),
                )
                resolved_incidents.append(row["id"])
    return {"run_id": run_id, "status": status, "validation": {key: value for key, value in contract.items() if key != "normalized"}, "incident": incident, "resolved_incidents": resolved_incidents}


@app.post("/api/sources/{source_id}/run", status_code=201)
def run_collector(source_id: str, payload: BrightDataCommand) -> dict[str, Any]:
    """Run the configured collector through the authenticated Bright Data CLI, then ingest it."""
    source = source_or_404(source_id)
    if not source["collector_id"]:
        raise HTTPException(409, "This source has no Bright Data Collector ID yet")
    target_url = str(payload.target_url or source["target_url"])
    command = ["npx", "-p", "@brightdata/cli", "bdata", "scraper", "run", source["collector_id"], target_url, "--pretty"]
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=300)
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(504, "Bright Data collector timed out") from exc
    if result.returncode:
        raise HTTPException(502, f"Bright Data run failed: {result.stderr.strip() or result.stdout.strip()}")
    records = parse_bright_data_json(result.stdout)
    return ingest(source_id, IngestPayload(records=records, raw_payload=records))


@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]:
    with db() as connection:
        sources = connection.execute("SELECT COUNT(*) AS value FROM sources").fetchone()["value"]
        jobs = connection.execute("SELECT COUNT(*) AS value FROM jobs").fetchone()["value"]
        incidents = connection.execute("SELECT COUNT(*) AS value FROM incidents WHERE status != 'resolved'").fetchone()["value"]
        latest = connection.execute("SELECT * FROM runs ORDER BY completed_at DESC LIMIT 1").fetchone()
        source = connection.execute("SELECT * FROM sources ORDER BY updated_at DESC LIMIT 1").fetchone()
    validation = json.loads(latest["validation"]) if latest else {"field_quality": {}}
    field_qualities = [
        {"name": field.replace("_", " ").title(), "key": "job_title" if field == "title" else field, "percentage": percentage, "expectedType": "string", "nullCount": 0, "totalRecords": latest["record_count"] if latest else 0, "status": "optimal" if percentage >= 90 else "warning" if percentage >= 70 else "critical"}
        for field, percentage in validation.get("field_quality", {}).items()
    ]
    health_score = latest["health_score"] if latest else 0
    primary_scraper = None
    if source:
        primary_scraper = source_to_scraper(source, latest)
    return {
        "stats": {"jobsTracked": jobs, "jobsTrackedTrend": 0, "companiesCount": 0, "companiesTrend": 0, "pipelineHealth": health_score, "pipelineHealthTrend": 0, "successfulRuns": 1 if latest and latest["status"] == "healthy" else 0, "successfulRunsToday": 1 if latest and latest["status"] == "healthy" else 0, "systemStatus": "healthy" if not incidents else "degraded", "openIncidentsCount": incidents, "resolvedIncidentsToday": 0, "avgRecoveryTimeMinutes": 0},
        "fieldQualities": field_qualities,
        "primaryScraper": primary_scraper,
        "latest_run": row_dict(latest) if latest else None,
        "sources": sources,
    }


def source_to_scraper(source: sqlite3.Row, latest: sqlite3.Row | None) -> dict[str, Any]:
    target_domain = source["target_url"].split("/")[2] if "://" in source["target_url"] else source["target_url"]
    validation = json.loads(latest["validation"]) if latest else {"field_quality": {}}
    return {
        "id": source["id"], "name": source["name"], "targetDomain": target_domain, "collectorId": source["collector_id"] or "pending", "status": source["status"],
        "healthScore": latest["health_score"] if latest else 0, "lastRunTime": latest["completed_at"] if latest else source["updated_at"], "lastRunRecords": latest["record_count"] if latest else 0,
        "avgLatencySeconds": 0, "successRate": 100 if latest and latest["status"] == "healthy" else 0, "proxyNetwork": "Bright Data Scraper Studio",
        "totalJobsExtracted": latest["record_count"] if latest else 0, "schemaVersion": "v1",
        "fields": [{"field": field, "type": "string", "required": True, "expected": True, "actual": percentage > 0, "sampleValue": "Validated" if percentage else "Missing", "matchRate": percentage} for field, percentage in validation.get("field_quality", {}).items()],
        "metricsHistory": [{"timestamp": latest["completed_at"], "timeLabel": "Latest run", "health": latest["health_score"], "latency": 0, "recordsExtracted": latest["record_count"], "successRate": 100 if latest["status"] == "healthy" else 0}] if latest else [],
    }


@app.get("/api/scrapers")
def scrapers() -> list[dict[str, Any]]:
    with db() as connection:
        sources = connection.execute("SELECT * FROM sources ORDER BY updated_at DESC").fetchall()
        runs = {row["source_id"]: row for row in connection.execute("SELECT * FROM runs WHERE id IN (SELECT MAX(id) FROM runs GROUP BY source_id)").fetchall()}
    return [source_to_scraper(source, runs.get(source["id"])) for source in sources]


def job_to_view(row: sqlite3.Row, source: sqlite3.Row | None) -> dict[str, Any]:
    skills = json.loads(row["skills"]) if row["skills"] else []
    location = row["location"] or ""
    quality_fields = [row["title"], row["company"], row["location"], row["source_url"]]
    quality_score = round(sum(bool(field) for field in quality_fields) / len(quality_fields) * 100)
    return {
        "id": row["id"],
        "title": row["title"] or "Untitled role",
        "company": row["company"] or "Unknown company",
        "location": location or "Not specified",
        "isRemote": "remote" in location.lower(),
        "experience": "Not specified",
        "salary": row["salary"] or "Not disclosed",
        "skills": skills,
        "description": row["description"] or "",
        "source": source["name"] if source else "Unknown source",
        "sourceUrl": row["source_url"] or "",
        "collectorId": source["collector_id"] if source and source["collector_id"] else "pending",
        "lastSeen": row["scraped_at"],
        "scrapedAt": row["scraped_at"],
        "qualityScore": quality_score,
        "fieldValidity": {
            "job_title": bool(row["title"]),
            "company": bool(row["company"]),
            "location": bool(row["location"]),
            "experience": False,
            "salary": bool(row["salary"]),
            "skills": len(skills) > 0,
            "description": bool(row["description"]),
        },
    }


@app.get("/api/jobs")
def jobs(limit: int = 100) -> list[dict[str, Any]]:
    with db() as connection:
        rows = connection.execute("SELECT * FROM jobs ORDER BY scraped_at DESC LIMIT ?", (min(limit, 500),)).fetchall()
        sources = {row["id"]: row for row in connection.execute("SELECT * FROM sources").fetchall()}
    return [job_to_view(row, sources.get(row["source_id"])) for row in rows]


STAGE_TITLES = {
    "detect": "Contract violation detected",
    "heal": "Bright Data heal requested",
    "heal_failed": "Bright Data heal attempt failed",
    "recover": "Recovery verified",
}


def event_to_view(event: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": event["id"],
        "timestamp": event["created_at"],
        "timeFormatted": human_time(event["created_at"]),
        "title": STAGE_TITLES.get(event["stage"], event["stage"].replace("_", " ").title()),
        "description": event["message"],
        "stage": "heal" if event["stage"] == "heal_failed" else event["stage"],
        "status": "done",
    }


def incident_to_view(row: sqlite3.Row, source: sqlite3.Row | None, record_count: int, events: list[sqlite3.Row]) -> dict[str, Any]:
    required_fields = json.loads(source["required_fields"]) if source else []
    affected_fields = [field for field in required_fields if field in row["diagnosis"]]
    is_resolved = row["status"] == "resolved"
    return {
        "id": row["id"],
        "title": row["title"],
        "source": source["name"] if source else "Unknown source",
        "collectorId": source["collector_id"] if source and source["collector_id"] else "pending",
        "severity": row["severity"],
        "status": row["status"],
        "detectedAt": row["created_at"],
        "resolvedAt": row["resolved_at"],
        "timeAgo": time_ago(row["created_at"]),
        "affectedFields": affected_fields,
        "healthBefore": row["health_before"] if row["health_before"] is not None else row["health_during"],
        "healthDuring": row["health_during"],
        "healthAfter": row["health_after"] if row["health_after"] is not None else row["health_during"],
        "recordsAffected": record_count,
        "rootCause": row["diagnosis"],
        "repairSummary": (
            f"Bright Data healed collector {source['collector_id']} and the recovered data now passes the {source['name']} contract."
            if is_resolved and source
            else "Awaiting Bright Data heal and a verified re-run before this incident can close."
        ),
        "recoveryStatus": "Auto-healed via Bright Data" if is_resolved else row["status"].replace("_", " ").title(),
        "timeline": [event_to_view(event) for event in events],
    }


@app.get("/api/incidents")
def incidents() -> list[dict[str, Any]]:
    with db() as connection:
        rows = connection.execute("SELECT * FROM incidents ORDER BY created_at DESC").fetchall()
        sources = {row["id"]: row for row in connection.execute("SELECT * FROM sources").fetchall()}
        runs = {row["id"]: row for row in connection.execute("SELECT * FROM runs").fetchall()}
        events = connection.execute("SELECT * FROM recovery_events ORDER BY created_at ASC").fetchall()
    events_by_incident: dict[str, list[sqlite3.Row]] = {}
    for event in events:
        events_by_incident.setdefault(event["incident_id"], []).append(event)
    return [
        incident_to_view(
            row,
            sources.get(row["source_id"]),
            runs[row["run_id"]]["record_count"] if row["run_id"] in runs else 0,
            events_by_incident.get(row["id"], []),
        )
        for row in rows
    ]


@app.post("/api/incidents/{incident_id}/heal")
def heal(incident_id: str, payload: BrightDataCommand) -> dict[str, Any]:
    with db() as connection:
        incident = connection.execute("SELECT incidents.*, sources.collector_id FROM incidents JOIN sources ON sources.id = incidents.source_id WHERE incidents.id = ?", (incident_id,)).fetchone()
    if not incident:
        raise HTTPException(404, "Incident not found")
    if not incident["collector_id"]:
        raise HTTPException(409, "This source has no Bright Data Collector ID yet")
    failure = payload.failure_description or incident["diagnosis"]
    # This command intentionally uses an argument list; no user-provided text is passed to a shell.
    command = ["npx", "-p", "@brightdata/cli", "bdata", "scraper", "heal", incident["collector_id"], failure]
    result = subprocess.run(command, capture_output=True, text=True, timeout=180)
    message = result.stdout.strip() or result.stderr.strip()
    stage = "heal" if result.returncode == 0 else "heal_failed"
    with db() as connection:
        connection.execute("INSERT INTO recovery_events VALUES (?, ?, ?, ?, ?)", (f"evt_{uuid.uuid4().hex[:10]}", incident_id, stage, message, now()))
        connection.execute("UPDATE incidents SET status = ? WHERE id = ?", ("healing" if result.returncode == 0 else "open", incident_id))
    if result.returncode:
        raise HTTPException(502, f"Bright Data heal command failed: {message}")
    return {"incident_id": incident_id, "collector_id": incident["collector_id"], "status": "healing", "output": message}
