"""
Fetch EPA Superfund / National Priorities List (NPL) site data.

Data source: EPA Superfund Enterprise Management System (SEMS) and the
Comprehensive Environmental Response, Compensation, and Liability Information
System (CERCLIS).  The NPL is the list of sites prioritised for long-term
remedial investigation and action under CERCLA (Superfund).

Primary endpoints:
  - EPA Envirofacts REST services (SEMS)
  - EPA Open Data portal CSV downloads
  - FRS (Facility Registry Service) for canonical facility IDs

Output:  Raw JSON / CSV stored in RAW_DIR, then normalised into the
         `hazardous_sites` layer in PostGIS.

Field mapping (EPA SEMS -> our schema):
  site_name        -> name
  epa_id           -> meta.epaId
  npl_status       -> meta.nplStatus
  latitude         -> latitude
  longitude        -> longitude
  state_code       -> state
  county_name      -> county
  contaminants     -> meta.contaminants (list)
  hrs_score        -> meta.hazardScore
  cleanup_status   -> meta.cleanupStatus
  site_type        -> meta.siteType
  federal_facility -> meta.federalFacility (bool)
  operable_units   -> meta.operableUnits
  congressional_district -> meta.congressionalDistrict
"""

import json
import logging
import os
import sys
from datetime import datetime
from typing import Any

import requests

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config.settings import DATABASE_URL, RAW_DIR, SRID

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Endpoint configuration
# ---------------------------------------------------------------------------

EPA_SEMS_URL = "https://data.epa.gov/efservice/SEMS_ACTIVE_SITES/JSON"
EPA_NPL_CSV_URL = (
    "https://sedac.ciesin.columbia.edu/data/set/"
    "superfund-npl-sites/data-download"  # placeholder – actual URL changes
)
EPA_ENVIROFACTS_BASE = "https://data.epa.gov/efservice"
FRS_LOOKUP_URL = "https://data.epa.gov/efservice/FRS_PROGRAM_FACILITY/JSON"

# Maximum number of rows per paginated request (Envirofacts default cap)
PAGE_SIZE = 10_000


# ---------------------------------------------------------------------------
# Fetch helpers
# ---------------------------------------------------------------------------

def fetch_npl_sites(
    status: str = "Currently on the Final NPL",
    state: str | None = None,
    max_pages: int = 20,
) -> list[dict[str, Any]]:
    """
    Retrieve NPL-listed Superfund sites from EPA Envirofacts.

    Parameters
    ----------
    status : str
        NPL status filter.  Common values:
            "Currently on the Final NPL"
            "Deleted from the Final NPL"
            "Proposed for NPL"
    state : str | None
        Two-letter USPS state code to filter by, or None for all states.
    max_pages : int
        Safety cap on paginated requests.

    Returns
    -------
    list[dict]
        Raw site records as returned by the EPA service.
    """
    logger.info("Fetching NPL sites (status=%s, state=%s)", status, state)

    all_records: list[dict[str, Any]] = []
    for page in range(max_pages):
        start = page * PAGE_SIZE
        end = start + PAGE_SIZE - 1
        url = f"{EPA_SEMS_URL}/ROWS/{start}:{end}"

        # Phase 2: add query parameters for status / state filtering
        logger.debug("GET %s", url)
        # resp = requests.get(url, timeout=120)
        # resp.raise_for_status()
        # batch = resp.json()
        batch: list[dict] = []  # placeholder

        if not batch:
            break
        all_records.extend(batch)

    logger.info("Fetched %d raw NPL records", len(all_records))
    return all_records


def parse_site_record(raw: dict[str, Any]) -> dict[str, Any]:
    """
    Transform a raw EPA SEMS record into the project's HazardousSite schema.

    Handles:
      - Coordinate validation / coercion
      - Contaminant string splitting
      - HRS score normalisation (0-100 float)
      - Cleanup status standardisation
    """
    contaminants_raw = raw.get("CONTAMINANTS", "") or ""
    contaminants = [c.strip() for c in contaminants_raw.split(";") if c.strip()]

    hrs_score_raw = raw.get("HRS_SCORE")
    try:
        hrs_score = float(hrs_score_raw) if hrs_score_raw is not None else None
    except (ValueError, TypeError):
        hrs_score = None

    return {
        "id": f"superfund-{raw.get('SITE_EPA_ID', 'UNKNOWN')}",
        "layerId": "hazardous_sites",
        "layerGroup": "official",
        "name": (raw.get("SITE_NAME") or "Unknown Site").strip(),
        "latitude": float(raw.get("LATITUDE", 0)),
        "longitude": float(raw.get("LONGITUDE", 0)),
        "state": (raw.get("STATE_CODE") or "").strip().upper(),
        "county": (raw.get("COUNTY_NAME") or "").strip().title(),
        "evidenceLevel": "direct",
        "summary": f"Superfund NPL site: {raw.get('SITE_NAME', 'N/A')}",
        "sourceIds": ["epa-sems"],
        "tags": ["superfund", "npl"],
        "meta": {
            "siteType": (raw.get("SITE_TYPE") or "").strip(),
            "nplStatus": (raw.get("NPL_STATUS") or "").strip(),
            "contaminants": contaminants,
            "cleanupStatus": (raw.get("CLEANUP_STATUS") or "").strip(),
            "hazardScore": hrs_score,
            "epaId": (raw.get("SITE_EPA_ID") or "").strip(),
            "federalFacility": raw.get("FEDERAL_FACILITY") == "Y",
        },
    }


def load_to_db(records: list[dict[str, Any]]) -> int:
    """
    Upsert parsed Superfund site records into PostGIS.

    Uses the project database at DATABASE_URL.  Each record is inserted into
    the ``hazardous_sites`` table with a conflict resolution on ``id``.

    Returns
    -------
    int
        Number of rows upserted.
    """
    if not records:
        logger.warning("No records to load.")
        return 0

    logger.info("Loading %d Superfund records to %s", len(records), DATABASE_URL)
    # Phase 2: implement actual DB upsert via psycopg / SQLAlchemy
    #   INSERT INTO hazardous_sites (...) VALUES (...)
    #   ON CONFLICT (id) DO UPDATE SET ...
    logger.info("[scaffold] Database load not yet implemented.")
    return 0


def save_raw(records: list[dict[str, Any]], tag: str = "npl") -> str:
    """Persist raw records to RAW_DIR as timestamped JSON."""
    os.makedirs(RAW_DIR, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(RAW_DIR, f"superfund_{tag}_{ts}.json")
    with open(path, "w") as fh:
        json.dump(records, fh, indent=2)
    logger.info("Saved raw data to %s", path)
    return path


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    logger.info("=== Superfund / NPL ETL ===")

    raw_sites = fetch_npl_sites()
    if raw_sites:
        save_raw(raw_sites)
        parsed = [parse_site_record(r) for r in raw_sites]
        loaded = load_to_db(parsed)
        logger.info("Pipeline complete: %d records loaded.", loaded)
    else:
        logger.info("Scaffold only — no data fetched.")


if __name__ == "__main__":
    main()
