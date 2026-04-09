"""
Fetch EPA eGRID power plant data.

Writes plant-level emissions records to raw/power_plants/<year>.jsonl.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config.settings import DATABASE_URL, RAW_DIR  # noqa: E402
from scripts.utils import (  # noqa: E402
    ensure_dir,
    get_logger,
    is_dry_run,
    safe_load_pipeline,
    step,
    write_json_records,
)

LOG = get_logger("egrid")
EGRID_BASE = "https://www.epa.gov/egrid/download-data"


def fetch_egrid(year: int = 2022) -> list[dict]:
    """Download and parse the eGRID Excel file for a given year."""
    LOG.info("fetching eGRID year %d", year)
    if is_dry_run():
        LOG.info("DRY RUN — would download eGRID %d from %s",
                 year, EGRID_BASE)
        return []

    # Phase 4: use pandas.read_excel with sheet=PLNT22 and project
    # to (plant_id, name, lat, lng, fuel, capacity_mw,
    #     co2_tons, so2_tons, nox_tons, status)
    LOG.warning("Scaffold only — Excel parsing not yet implemented.")
    return []


def write_output(records: list[dict], year: int) -> None:
    target_dir = ensure_dir(Path(RAW_DIR) / "power_plants")
    dest = target_dir / f"egrid_{year}.jsonl"
    n = write_json_records(records, dest)
    LOG.info("wrote %d records to %s", n, dest)


def main(year: int = 2022) -> None:
    LOG.info("DATABASE_URL=%s", DATABASE_URL)
    records = safe_load_pipeline(
        "fetch_egrid", lambda: fetch_egrid(year)
    ) or []
    with step("write power plants output"):
        write_output(records, year)


if __name__ == "__main__":
    year_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 2022
    main(year_arg)
