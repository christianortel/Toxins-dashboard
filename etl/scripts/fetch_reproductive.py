"""
Fetch reproductive health indicators from CDC WONDER Natality.

Pulls county-level natality records (preterm, LBW, fetal death)
and writes them to raw/reproductive/<year>.jsonl.
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

LOG = get_logger("repro")
CDC_WONDER_BASE = "https://wonder.cdc.gov/controller/datarequest/D66"
METRICS = ["preterm_birth", "low_birth_weight", "fetal_death", "fertility_rate"]


def fetch_natality(year: int = 2022) -> list[dict]:
    """Query CDC WONDER Natality for a given reporting year."""
    LOG.info("fetching natality for year %d", year)
    if is_dry_run():
        LOG.info("DRY RUN — would POST to %s with metrics %s",
                 CDC_WONDER_BASE, METRICS)
        return []
    # CDC WONDER requires an XML POST with licensing agreement acceptance.
    # Phase 4 will implement this via the `wonderpy` helper package.
    LOG.warning("Scaffold only — CDC WONDER POST not yet implemented.")
    return []


def write_output(records: list[dict], year: int) -> None:
    target_dir = ensure_dir(Path(RAW_DIR) / "reproductive")
    dest = target_dir / f"natality_{year}.jsonl"
    n = write_json_records(records, dest)
    LOG.info("wrote %d records to %s", n, dest)


def main(year: int = 2022) -> None:
    LOG.info("DATABASE_URL=%s", DATABASE_URL)
    records = safe_load_pipeline(
        "fetch_natality", lambda: fetch_natality(year)
    ) or []
    with step("write reproductive output"):
        write_output(records, year)


if __name__ == "__main__":
    year_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 2022
    main(year_arg)
