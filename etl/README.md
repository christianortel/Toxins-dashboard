# DOWNSTREAM — ETL Pipeline

Python-based data extraction, transformation, and loading scripts for the
DOWNSTREAM project. Fetchers hit public federal data endpoints, normalize
the responses, and write newline-delimited JSON into `data/raw/<source>/`
for downstream loading into PostgreSQL + PostGIS.

## Requirements

- Python 3.10+
- pandas
- geopandas
- shapely
- pyarrow
- psycopg2-binary
- requests
- python-dotenv

## Setup

```bash
cd etl
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env  # if present; otherwise export DATABASE_URL
```

Environment variables honored:

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://downstream:downstream@localhost:5432/downstream` | Postgres connection |
| `DOWNSTREAM_ETL_DRY_RUN` | `0` | When `1`, fetchers log intended calls without making them |

## Structure

```
etl/
  config/
    settings.py       # env-driven paths and DB URL
    sources.json      # data source manifest (id, endpoint, fetcher, license)
  scripts/
    utils.py          # shared: logger, HTTP retry, step timer, dry-run
    fetch_tri.py
    fetch_superfund.py
    fetch_pfas.py
    fetch_power_plants.py
    fetch_wastewater.py
    fetch_enforcement.py
    fetch_sentinel.py
    fetch_reproductive.py
    load_geographies.py
  requirements.txt
  README.md
```

## Shared utilities

Every fetcher imports from `scripts/utils.py`:

- `get_logger(name)` — consistent stderr-bound logger
- `http_get_with_retry(url, ...)` — exponential-backoff GET (2s, 4s, 8s, 16s)
- `write_json_records(records, dest)` — newline-delimited JSON writer
- `step(name)` — context manager that times a block of work
- `safe_load_pipeline(name, fn)` — error-contained pipeline runner
- `is_dry_run()` — honors `DOWNSTREAM_ETL_DRY_RUN=1`
- `ensure_dir(path)` — `mkdir -p`
- `chunked(seq, size)` — batch iterator

## Data Sources

| Source | Script | Agency | Cadence | Status |
|---|---|---|---|---|
| EPA TRI | `fetch_tri.py` | EPA | Annual | Envirofacts REST wired (scaffold) |
| EPA Superfund / NPL | `fetch_superfund.py` | EPA | Quarterly | Scaffold |
| EPA PFAS (UCMR 5) | `fetch_pfas.py` | EPA Water | Quarterly | Scaffold |
| EPA eGRID Power Plants | `fetch_power_plants.py` | EPA | Annual | Scaffold |
| EPA NPDES Wastewater | `fetch_wastewater.py` | EPA | Monthly | Scaffold |
| EPA ECHO Enforcement | `fetch_enforcement.py` | EPA | Weekly | REST wired (scaffold) |
| USGS Wildlife Sentinels | `fetch_sentinel.py` | USGS | Annual | Scaffold |
| CDC WONDER Natality | `fetch_reproductive.py` | CDC NCHS | Annual | Scaffold |
| Census TIGER/Line | `load_geographies.py` | U.S. Census | Annual | Scaffold |

## Running a fetcher

```bash
# Dry run — logs intended calls, writes nothing network-backed
DOWNSTREAM_ETL_DRY_RUN=1 python scripts/fetch_tri.py 2022 WV

# Real run
python scripts/fetch_tri.py 2022 WV
```

Output lands in `etl/data/raw/<source>/<filename>.jsonl`.

## Status

This pipeline is scaffolded for Phase 2. Transform and load stages
(normalization into the unified entity schema, geocoding verification,
and PostGIS insertion) will be implemented once the raw fetch stage is
validated against live endpoints.
