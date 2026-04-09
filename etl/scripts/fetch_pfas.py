"""
Fetch PFAS (per- and polyfluoroalkyl substances) contamination data.

Data sources:
  1. UCMR 5 (Fifth Unregulated Contaminant Monitoring Rule) — EPA
     Nationwide drinking-water monitoring for 29 PFAS analytes, collected
     2023-2025 from public water systems serving > 3,300 people.
     Endpoint: https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule

  2. State PFAS site inventories — various state environmental agencies
     maintain their own registries of known PFAS contamination sites
     (e.g., Michigan PFAS Action Response Team, Minnesota PCA).

  3. EPA PFAS Analytic Tools — aggregated federal PFAS data
     https://echo.epa.gov/trends/pfas-tools

Field mapping (UCMR5 -> our schema):
  PWSID             -> meta.pwsId
  FacilityName      -> name
  Analyte           -> meta.pfasCompounds (list)
  AnalyticalResult  -> meta.maxConcentrationPpt
  State             -> state
  County            -> county
  SamplePointType   -> meta.mediumTested
"""

import csv
import io
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

UCMR5_DATA_URL = (
    "https://www.epa.gov/system/files/other-files/"
    "ucmr5-occurrence-data.zip"  # placeholder — actual file varies per release
)
UCMR5_METADATA_URL = (
    "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule"
)

# State PFAS inventories — representative subset
STATE_PFAS_ENDPOINTS: dict[str, str] = {
    "MI": "https://www.michigan.gov/pfasresponse/mapping/pfas-sites-data.json",
    "MN": "https://www.pca.state.mn.us/pfas-data-download",
    "NJ": "https://www.nj.gov/dep/srp/pfas/pfas-sites.json",
    "NH": "https://www4.des.state.nh.us/DESOnestop/pfas-data.json",
    "NC": "https://www.deq.nc.gov/pfas/pfas-sites-data.json",
}

EPA_PFAS_TOOLS_URL = "https://echo.epa.gov/trends/pfas-tools"

# UCMR5 analytes of interest (subset)
PRIORITY_ANALYTES = [
    "PFOA", "PFOS", "PFHxS", "PFNA", "PFDA", "PFBS",
    "GenX", "HFPO-DA", "ADONA", "PFHpA", "PFHxA",
]


# ---------------------------------------------------------------------------
# UCMR 5 pipeline
# ---------------------------------------------------------------------------

def fetch_ucmr5_data(download_dir: str | None = None) -> list[dict[str, Any]]:
    """
    Download and parse the latest UCMR 5 occurrence data from EPA.

    The data is distributed as a zipped CSV.  This function downloads the
    archive, extracts the occurrence table, and returns rows as dicts.

    Parameters
    ----------
    download_dir : str | None
        Directory for the raw download.  Defaults to RAW_DIR.

    Returns
    -------
    list[dict]
        Raw occurrence records (one row per sample result).
    """
    target_dir = download_dir or RAW_DIR
    os.makedirs(target_dir, exist_ok=True)

    logger.info("Downloading UCMR5 data from %s", UCMR5_DATA_URL)
    # Phase 2: implement actual download + ZIP extraction
    # resp = requests.get(UCMR5_DATA_URL, timeout=300, stream=True)
    # resp.raise_for_status()
    # ... extract CSV from ZIP ...

    records: list[dict[str, Any]] = []  # placeholder
    logger.info("Parsed %d UCMR5 occurrence rows", len(records))
    return records


# ---------------------------------------------------------------------------
# State-level PFAS data
# ---------------------------------------------------------------------------

def fetch_state_pfas_sites(
    states: list[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Fetch PFAS contamination site records from state agency endpoints.

    Parameters
    ----------
    states : list[str] | None
        Two-letter state codes to include.  None fetches all configured states.

    Returns
    -------
    list[dict]
        Raw records from state agencies.
    """
    target_states = states or list(STATE_PFAS_ENDPOINTS.keys())
    all_records: list[dict[str, Any]] = []

    for state_code in target_states:
        url = STATE_PFAS_ENDPOINTS.get(state_code)
        if not url:
            logger.warning("No endpoint configured for state %s", state_code)
            continue

        logger.info("Fetching PFAS sites for %s from %s", state_code, url)
        # Phase 2: implement per-state fetching + format normalisation
        # resp = requests.get(url, timeout=120)
        # resp.raise_for_status()
        # records = resp.json()  # or parse CSV, HTML, etc.
        logger.debug("[scaffold] Skipping actual fetch for %s", state_code)

    logger.info("Collected %d state PFAS records total", len(all_records))
    return all_records


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------

def normalize_pfas_records(
    ucmr_records: list[dict[str, Any]],
    state_records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Merge and normalise PFAS records from UCMR5 and state sources into the
    project's PfasSite schema.

    Deduplication strategy:
      - Match on (latitude, longitude, pwsId) within a 0.001-degree tolerance.
      - When duplicates exist, prefer UCMR5 analytical values and supplement
        with state-reported metadata.

    Returns
    -------
    list[dict]
        Normalised PfasSite-shaped records ready for DB load.
    """
    normalised: list[dict[str, Any]] = []

    for raw in ucmr_records:
        record = _ucmr_to_pfas_site(raw)
        if record:
            normalised.append(record)

    for raw in state_records:
        record = _state_to_pfas_site(raw)
        if record:
            normalised.append(record)

    # Phase 2: deduplication pass
    logger.info("Normalised %d PFAS records", len(normalised))
    return normalised


def _ucmr_to_pfas_site(raw: dict[str, Any]) -> dict[str, Any] | None:
    """Convert a single UCMR5 occurrence row to PfasSite shape."""
    try:
        concentration = float(raw.get("AnalyticalResult", 0))
    except (ValueError, TypeError):
        concentration = None

    return {
        "id": f"pfas-ucmr5-{raw.get('PWSID', 'UNK')}-{raw.get('Analyte', 'UNK')}",
        "layerId": "pfas_sites",
        "layerGroup": "emerging",
        "name": (raw.get("FacilityName") or "Unknown PWS").strip(),
        "latitude": float(raw.get("Latitude", 0)),
        "longitude": float(raw.get("Longitude", 0)),
        "state": (raw.get("State") or "").strip().upper(),
        "county": (raw.get("County") or "").strip().title(),
        "evidenceLevel": "direct",
        "summary": f"PFAS detection ({raw.get('Analyte', 'N/A')}) in drinking water",
        "sourceIds": ["epa-ucmr5"],
        "tags": ["pfas", "ucmr5", "drinking-water"],
        "meta": {
            "siteType": "public_water_system",
            "pfasCompounds": [raw.get("Analyte", "")],
            "maxConcentrationPpt": concentration,
            "mediumTested": (raw.get("SamplePointType") or "finished_water").strip(),
            "pwsId": raw.get("PWSID"),
        },
    }


def _state_to_pfas_site(raw: dict[str, Any]) -> dict[str, Any] | None:
    """Convert a state-reported PFAS record to PfasSite shape."""
    return {
        "id": f"pfas-state-{raw.get('state', 'UNK')}-{raw.get('site_id', 'UNK')}",
        "layerId": "pfas_sites",
        "layerGroup": "emerging",
        "name": (raw.get("site_name") or "Unknown Site").strip(),
        "latitude": float(raw.get("latitude", 0)),
        "longitude": float(raw.get("longitude", 0)),
        "state": (raw.get("state") or "").strip().upper(),
        "county": (raw.get("county") or "").strip().title(),
        "evidenceLevel": "direct",
        "summary": f"State-reported PFAS contamination site",
        "sourceIds": [f"state-pfas-{raw.get('state', 'UNK').lower()}"],
        "tags": ["pfas", "state-program"],
        "meta": {
            "siteType": (raw.get("site_type") or "").strip(),
            "pfasCompounds": raw.get("compounds", []),
            "maxConcentrationPpt": raw.get("max_concentration_ppt"),
            "mediumTested": (raw.get("medium") or "").strip(),
        },
    }


# ---------------------------------------------------------------------------
# DB load
# ---------------------------------------------------------------------------

def load_to_db(records: list[dict[str, Any]]) -> int:
    """Upsert normalised PFAS records into PostGIS."""
    if not records:
        logger.warning("No PFAS records to load.")
        return 0

    logger.info("Loading %d PFAS records to %s", len(records), DATABASE_URL)
    # Phase 2: implement upsert
    logger.info("[scaffold] Database load not yet implemented.")
    return 0


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    logger.info("=== PFAS Contamination ETL ===")

    ucmr = fetch_ucmr5_data()
    state = fetch_state_pfas_sites()
    normalised = normalize_pfas_records(ucmr, state)

    if normalised:
        loaded = load_to_db(normalised)
        logger.info("Pipeline complete: %d records loaded.", loaded)
    else:
        logger.info("Scaffold only — no data fetched.")


if __name__ == "__main__":
    main()
