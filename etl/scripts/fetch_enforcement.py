"""
Fetch EPA ECHO enforcement and compliance data.

Pulls facility-level enforcement action records and writes them to
raw/enforcement/<year>.jsonl.
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
    http_get_with_retry,
    is_dry_run,
    safe_load_pipeline,
    step,
    write_json_records,
)

LOG = get_logger("echo")
ECHO_REST = "https://echodata.epa.gov/echo/case_rest_services.get_cases"


def fetch_enforcement(state: str = "WV", limit: int = 500) -> list[dict]:
    """Query ECHO REST for recent enforcement cases in a state."""
    LOG.info("fetching ECHO enforcement cases for state=%s limit=%d",
             state, limit)
    if is_dry_run():
        LOG.info("DRY RUN — would call %s", ECHO_REST)
        return []

    try:
        resp = http_get_with_retry(
            ECHO_REST,
            params={
                "p_act_st": state,
                "p_pen_amt_min": 0,
                "responseset": limit,
                "output": "JSON",
            },
        )
        data = resp.json()
        cases = data.get("Results", {}).get("Cases", [])
        LOG.info("fetched %d cases", len(cases))
        return cases
    except Exception as exc:
        LOG.error("ECHO fetch failed: %s", exc)
        return []


def write_output(records: list[dict], state: str) -> None:
    target_dir = ensure_dir(Path(RAW_DIR) / "enforcement")
    dest = target_dir / f"echo_{state.lower()}.jsonl"
    n = write_json_records(records, dest)
    LOG.info("wrote %d records to %s", n, dest)


def main(state: str = "WV") -> None:
    LOG.info("DATABASE_URL=%s", DATABASE_URL)
    records = safe_load_pipeline(
        "fetch_enforcement", lambda: fetch_enforcement(state)
    ) or []
    with step("write enforcement output"):
        write_output(records, state)


if __name__ == "__main__":
    state_arg = sys.argv[1] if len(sys.argv) > 1 else "WV"
    main(state_arg)
