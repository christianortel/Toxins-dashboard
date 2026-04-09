"""
Fetch EPA Toxics Release Inventory (TRI) facility records.

Pulls facility-level release data from the EPA Envirofacts REST API
and writes normalized records to raw/tri/<year>_<state>.jsonl.

The EPA Envirofacts endpoint accepts path-style query composition:
  https://data.epa.gov/efservice/<TABLE>/<FIELD>/<OP>/<VALUE>/JSON

We query `tri_facility` filtered by reporting year and state abbreviation,
then normalize the response into a flat record shape that downstream
transforms can safely ingest.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config.settings import DATABASE_URL, EPA_TRI_BASE_URL, RAW_DIR  # noqa: E402
from scripts.utils import (  # noqa: E402
    ensure_dir,
    get_logger,
    http_get_with_retry,
    is_dry_run,
    safe_load_pipeline,
    step,
    write_json_records,
)

LOG = get_logger("tri")

# EPA Envirofacts REST — tri_facility table
TRI_FACILITY_URL = (
    f"{EPA_TRI_BASE_URL}/tri_facility/reporting_year/equals/{{year}}"
    f"/state_abbr/equals/{{state}}/JSON"
)


def fetch_tri_facilities(year: int, state: str) -> list[dict]:
    """Query EPA Envirofacts for TRI facilities in a state for a given year."""
    url = TRI_FACILITY_URL.format(year=year, state=state.upper())
    LOG.info("fetching TRI facilities year=%d state=%s", year, state)

    if is_dry_run():
        LOG.info("DRY RUN — would call %s", url)
        return []

    try:
        resp = http_get_with_retry(url)
        payload = resp.json()
        # Envirofacts returns a list of dicts, each keyed by column name.
        if not isinstance(payload, list):
            LOG.warning("unexpected payload shape: %s", type(payload).__name__)
            return []
        LOG.info("fetched %d TRI facility records", len(payload))
        return payload
    except Exception as exc:
        LOG.error("TRI fetch failed: %s", exc)
        return []


def normalize_record(row: dict, year: int) -> dict:
    """Flatten a TRI facility record into a predictable schema."""
    return {
        "source": "tri",
        "reporting_year": year,
        "tri_facility_id": row.get("TRI_FACILITY_ID") or row.get("tri_facility_id"),
        "facility_name": row.get("FACILITY_NAME") or row.get("facility_name"),
        "parent_company": row.get("PARENT_CO_NAME") or row.get("parent_co_name"),
        "street_address": row.get("STREET_ADDRESS") or row.get("street_address"),
        "city": row.get("CITY_NAME") or row.get("city_name"),
        "county": row.get("COUNTY_NAME") or row.get("county_name"),
        "state": row.get("STATE_ABBR") or row.get("state_abbr"),
        "zip": row.get("ZIP_CODE") or row.get("zip_code"),
        "latitude": row.get("PREF_LATITUDE") or row.get("pref_latitude"),
        "longitude": row.get("PREF_LONGITUDE") or row.get("pref_longitude"),
        "industry_sector": row.get("INDUSTRY_SECTOR") or row.get("industry_sector"),
        "federal_facility": row.get("FEDERAL_FACILITY") or row.get("federal_facility"),
        "raw": row,
    }


def write_output(records: list[dict], year: int, state: str) -> None:
    target_dir = ensure_dir(Path(RAW_DIR) / "tri")
    dest = target_dir / f"tri_{year}_{state.lower()}.jsonl"
    n = write_json_records(records, dest)
    LOG.info("wrote %d records to %s", n, dest)


def main(year: int = 2022, state: str = "WV") -> None:
    LOG.info("DATABASE_URL=%s", DATABASE_URL)
    raw_records = safe_load_pipeline(
        "fetch_tri", lambda: fetch_tri_facilities(year, state)
    ) or []
    with step("normalize TRI records"):
        normalized = [normalize_record(r, year) for r in raw_records]
    with step("write TRI output"):
        write_output(normalized, year, state)


if __name__ == "__main__":
    year_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 2022
    state_arg = sys.argv[2] if len(sys.argv) > 2 else "WV"
    main(year_arg, state_arg)
