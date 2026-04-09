"""
Load Census TIGER/Line geographies into the DOWNSTREAM PostGIS database.

Loads:
  - state polygons
  - county polygons
  - census tracts (optional, large)

Loaded once per Census release (annual).
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
)

LOG = get_logger("geo")

TIGER_BASE = "https://www2.census.gov/geo/tiger/TIGER2024"
GEOGRAPHIES = {
    "states": f"{TIGER_BASE}/STATE/tl_2024_us_state.zip",
    "counties": f"{TIGER_BASE}/COUNTY/tl_2024_us_county.zip",
}


def fetch_geographies() -> None:
    """Download Census TIGER/Line shapefiles for states and counties."""
    target_dir = ensure_dir(Path(RAW_DIR) / "tiger")
    LOG.info("TIGER target dir: %s", target_dir)

    if is_dry_run():
        LOG.info("DRY RUN — would download %d shapefiles", len(GEOGRAPHIES))
        for name, url in GEOGRAPHIES.items():
            LOG.info("  %s ← %s", name, url)
        return

    # Phase 4 will implement actual download via requests + zipfile.
    LOG.warning("Scaffold only — Phase 4 will implement download + load.")
    LOG.info("Database URL: %s", DATABASE_URL)


def load_to_postgis() -> None:
    """Load downloaded shapefiles into the geography tables."""
    with step("load states/counties to PostGIS"):
        if is_dry_run():
            LOG.info("DRY RUN — skipping shp2pgsql")
            return
        # Phase 4: invoke shp2pgsql or geopandas.GeoDataFrame.to_postgis
        LOG.warning("Scaffold only — geometry loader not yet implemented.")


def main() -> None:
    safe_load_pipeline("fetch_geographies", fetch_geographies)
    safe_load_pipeline("load_to_postgis", load_to_postgis)


if __name__ == "__main__":
    main()
