# DOWNSTREAM — ETL Pipeline

Python-based data extraction, transformation, and loading scripts for the DOWNSTREAM project.

## Requirements

- Python 3.10+
- pandas
- geopandas
- shapely
- pyarrow
- psycopg2-binary
- requests

## Setup

```bash
cd etl
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Structure

```
etl/
  scripts/        # Individual ETL scripts per data source
  config/         # Configuration files and environment settings
  requirements.txt
  README.md
```

## Data Sources (Planned)

| Source | Script | Status |
|--------|--------|--------|
| EPA TRI | `fetch_tri.py` | Planned |
| EPA Superfund | `fetch_superfund.py` | Planned |
| EPA PFAS | `fetch_pfas.py` | Planned |
| USGS Sentinel Species | `fetch_sentinel.py` | Planned |
| CDC Reproductive Health | `fetch_reproductive.py` | Planned |
| EPA ECHO Enforcement | `fetch_enforcement.py` | Planned |
| Census Geographies | `fetch_geographies.py` | Planned |
