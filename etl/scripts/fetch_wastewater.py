"""
Fetch EPA NPDES wastewater discharge monitoring records.

Writes facility-level discharge records to raw/wastewater/<year>.jsonl.
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

LOG = get_logger("npdes")
ECHO_NPDES = "https://echodata.epa.gov/echo/eff_rest_services.get_download"


def fetch_npdes(year: int = 2023) -> list[dict]:
    """Query ECHO Effluent Charts for NPDES discharge records."""
    LOG.info("fetching NPDES wastewater for year %d", year)
    if is_dry_run():
        LOG.info("DRY RUN — would call %s", ECHO_NPDES)
        return []

    # Phase 4: POST query for DMR (Discharge Monitoring Reports)
    # with pollutant filters for PFAS, nitrogen, heavy metals.
    LOG.warning("Scaffold only — NPDES fetch not yet implemented.")
    return []


def write_output(records: list[dict], year: int) -> None:
    target_dir = ensure_dir(Path(RAW_DIR) / "wastewater")
    dest = target_dir / f"npdes_{year}.jsonl"
    n = write_json_records(records, dest)
    LOG.info("wrote %d records to %s", n, dest)


def main(year: int = 2023) -> None:
    LOG.info("DATABASE_URL=%s", DATABASE_URL)
    records = safe_load_pipeline(
        "fetch_npdes", lambda: fetch_npdes(year)
    ) or []
    with step("write wastewater output"):
        write_output(records, year)


if __name__ == "__main__":
    year_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 2023
    main(year_arg)
