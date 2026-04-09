"""
Fetch sentinel species observation data from federal and state monitoring programs.

Sentinel species — organisms whose health status reflects broader environmental
conditions — serve as biological early-warning systems for contamination.  Fish,
amphibians, and freshwater mussels are particularly sensitive to waterborne
pollutants and endocrine-disrupting compounds.

Data sources:
  1. USGS BioData / Aquatic Bioassessment — national database of fish tissue
     contaminant data, community surveys, and fish health indicators.
     https://aquatic.biodata.usgs.gov

  2. USGS Amphibian Research and Monitoring Initiative (ARMI)
     https://armi.usgs.gov

  3. NatureServe / GBIF occurrence records — supplemental species observation
     data for distribution and population trend context.

  4. State fish consumption advisory databases — compiled by EPA from state
     programs.
     https://fishadvisoryonline.epa.gov/General.aspx

Field mapping (USGS BioData -> our schema):
  SiteNumber         -> meta.usgsSiteId
  SiteName           -> name
  Latitude           -> latitude
  Longitude          -> longitude
  StateCode          -> state
  TaxonName          -> meta.species / meta.scientificName
  TaxonGroup         -> meta.taxonGroup
  Contaminant        -> meta.associatedContaminants (list)
  TissueConc_ugkg    -> meta.tissueConcentration
  ObservationType    -> meta.observationType
  AbnormalityType    -> meta.observationType (mapped)
  AbnormalityRate    -> meta.severity (binned)
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

USGS_BIODATA_URL = "https://aquatic.biodata.usgs.gov/api/v1"
USGS_BIODATA_TISSUE_ENDPOINT = f"{USGS_BIODATA_URL}/tissue-contaminants"
USGS_BIODATA_COMMUNITY_ENDPOINT = f"{USGS_BIODATA_URL}/community-samples"

ARMI_BASE_URL = "https://armi.usgs.gov/api"
ARMI_OBSERVATIONS_ENDPOINT = f"{ARMI_BASE_URL}/observations"
ARMI_ABNORMALITIES_ENDPOINT = f"{ARMI_BASE_URL}/abnormalities"

EPA_FISH_ADVISORY_URL = (
    "https://fishadvisoryonline.epa.gov/services/fishadvisory.json"
)

# Contaminants of interest for tissue residue queries
TARGET_CONTAMINANTS = [
    "Mercury", "PCBs", "PFOS", "PFOA", "Selenium",
    "Arsenic", "Lead", "Cadmium", "DDT", "Dieldrin",
    "Chlordane", "Dioxins",
]

# Severity thresholds for abnormality rates (percentage of sampled population)
SEVERITY_BINS = {
    "low": (0.0, 5.0),
    "moderate": (5.0, 15.0),
    "high": (15.0, 30.0),
    "critical": (30.0, 100.0),
}

PAGE_SIZE = 5_000


# ---------------------------------------------------------------------------
# USGS fish data
# ---------------------------------------------------------------------------

def fetch_usgs_fish_data(
    states: list[str] | None = None,
    contaminants: list[str] | None = None,
    min_year: int = 2000,
) -> list[dict[str, Any]]:
    """
    Retrieve fish tissue contaminant data and health observations from
    USGS BioData.

    Parameters
    ----------
    states : list[str] | None
        Two-letter state codes to filter by. None for all states.
    contaminants : list[str] | None
        Contaminant names to filter by. Defaults to TARGET_CONTAMINANTS.
    min_year : int
        Earliest sample year to include.

    Returns
    -------
    list[dict]
        Raw observation records from BioData.
    """
    target_contaminants = contaminants or TARGET_CONTAMINANTS
    logger.info(
        "Fetching USGS fish data (states=%s, contaminants=%d, min_year=%d)",
        states or "ALL", len(target_contaminants), min_year,
    )

    all_records: list[dict[str, Any]] = []

    # Phase 2: paginated fetch from BioData REST API
    # params = {
    #     "contaminantNames": ",".join(target_contaminants),
    #     "minYear": min_year,
    #     "format": "json",
    # }
    # if states:
    #     params["stateCodes"] = ",".join(states)
    #
    # for offset in range(0, 100_000, PAGE_SIZE):
    #     params["offset"] = offset
    #     params["limit"] = PAGE_SIZE
    #     resp = requests.get(USGS_BIODATA_TISSUE_ENDPOINT, params=params, timeout=120)
    #     resp.raise_for_status()
    #     batch = resp.json().get("results", [])
    #     if not batch:
    #         break
    #     all_records.extend(batch)

    logger.info("Fetched %d USGS fish records", len(all_records))
    return all_records


# ---------------------------------------------------------------------------
# Amphibian monitoring
# ---------------------------------------------------------------------------

def fetch_amphibian_monitoring(
    states: list[str] | None = None,
    include_abnormalities: bool = True,
    min_year: int = 2005,
) -> list[dict[str, Any]]:
    """
    Retrieve amphibian observation and abnormality records from USGS ARMI.

    ARMI tracks amphibian populations across federal lands with particular
    attention to malformations (limb deformities, integument lesions) that
    may signal endocrine disruption or habitat degradation.

    Parameters
    ----------
    states : list[str] | None
        State filter. None for all.
    include_abnormalities : bool
        If True, also fetch the abnormalities dataset and merge.
    min_year : int
        Earliest observation year to include.

    Returns
    -------
    list[dict]
        Raw ARMI observation records.
    """
    logger.info(
        "Fetching ARMI amphibian data (states=%s, abnormalities=%s, min_year=%d)",
        states or "ALL", include_abnormalities, min_year,
    )

    observations: list[dict[str, Any]] = []

    # Phase 2: fetch observations
    # params = {"minYear": min_year, "format": "json"}
    # if states:
    #     params["stateCodes"] = ",".join(states)
    # resp = requests.get(ARMI_OBSERVATIONS_ENDPOINT, params=params, timeout=120)
    # resp.raise_for_status()
    # observations = resp.json().get("results", [])

    if include_abnormalities:
        # Phase 2: fetch abnormality data and merge on site/species key
        # resp = requests.get(ARMI_ABNORMALITIES_ENDPOINT, params=params, timeout=120)
        # resp.raise_for_status()
        # abnormalities = resp.json().get("results", [])
        # observations = _merge_abnormalities(observations, abnormalities)
        pass

    logger.info("Fetched %d amphibian observation records", len(observations))
    return observations


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------

def _classify_severity(abnormality_rate: float | None) -> str:
    """Bin a numeric abnormality rate into a severity category."""
    if abnormality_rate is None:
        return "low"
    for level, (lo, hi) in SEVERITY_BINS.items():
        if lo <= abnormality_rate < hi:
            return level
    return "critical"


def _infer_observation_type(raw: dict[str, Any]) -> str:
    """
    Map raw record fields to a standardised observation type.

    Possible values: tissue_contamination, morphological_abnormality,
    population_decline, reproductive_anomaly, behavioral_change.
    """
    if raw.get("TissueConc_ugkg") is not None:
        return "tissue_contamination"
    if raw.get("AbnormalityType"):
        return "morphological_abnormality"
    if raw.get("PopulationTrend") == "declining":
        return "population_decline"
    return "observation"


def normalize_observations(
    fish_records: list[dict[str, Any]],
    amphibian_records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Merge and normalise fish and amphibian records into the project's
    SentinelRecord schema.

    Handles:
      - Coordinate validation
      - Taxon name cleaning and group assignment
      - Severity classification from abnormality rates
      - Contaminant list normalisation

    Returns
    -------
    list[dict]
        SentinelRecord-shaped dicts ready for DB load.
    """
    normalised: list[dict[str, Any]] = []

    for raw in fish_records:
        record = _fish_to_sentinel(raw)
        if record:
            normalised.append(record)

    for raw in amphibian_records:
        record = _amphibian_to_sentinel(raw)
        if record:
            normalised.append(record)

    # Phase 2: deduplication on (site, species, year)
    logger.info("Normalised %d sentinel species records", len(normalised))
    return normalised


def _fish_to_sentinel(raw: dict[str, Any]) -> dict[str, Any] | None:
    """Convert a USGS BioData fish record to SentinelRecord shape."""
    contaminants_raw = raw.get("Contaminant", "")
    contaminants = [c.strip() for c in str(contaminants_raw).split(";") if c.strip()]
    abnormality_rate = raw.get("AbnormalityRate")

    return {
        "id": f"sentinel-fish-{raw.get('SiteNumber', 'UNK')}-{raw.get('SampleId', 'UNK')}",
        "layerId": "sentinel_species",
        "layerGroup": "wildlife",
        "name": (raw.get("SiteName") or "Unknown Site").strip(),
        "latitude": float(raw.get("Latitude", 0)),
        "longitude": float(raw.get("Longitude", 0)),
        "state": (raw.get("StateCode") or "").strip().upper(),
        "county": (raw.get("CountyName") or "").strip().title(),
        "evidenceLevel": "proxy",
        "summary": f"Fish health observation: {raw.get('TaxonName', 'N/A')}",
        "sourceIds": ["usgs-biodata"],
        "tags": ["sentinel", "fish", "tissue-contaminant"],
        "meta": {
            "species": (raw.get("TaxonName") or "").strip(),
            "scientificName": (raw.get("ScientificName") or "").strip(),
            "taxonGroup": "fish",
            "observationType": _infer_observation_type(raw),
            "severity": _classify_severity(abnormality_rate),
            "associatedContaminants": contaminants,
            "usgsSiteId": raw.get("SiteNumber"),
            "tissueConcentration": raw.get("TissueConc_ugkg"),
        },
    }


def _amphibian_to_sentinel(raw: dict[str, Any]) -> dict[str, Any] | None:
    """Convert an ARMI amphibian record to SentinelRecord shape."""
    abnormality_rate = raw.get("AbnormalityRate")
    contaminants = raw.get("AssociatedContaminants", [])
    if isinstance(contaminants, str):
        contaminants = [c.strip() for c in contaminants.split(";") if c.strip()]

    return {
        "id": f"sentinel-amphibian-{raw.get('SiteId', 'UNK')}-{raw.get('ObservationId', 'UNK')}",
        "layerId": "sentinel_species",
        "layerGroup": "wildlife",
        "name": (raw.get("SiteName") or "Unknown Site").strip(),
        "latitude": float(raw.get("Latitude", 0)),
        "longitude": float(raw.get("Longitude", 0)),
        "state": (raw.get("StateCode") or "").strip().upper(),
        "county": (raw.get("CountyName") or "").strip().title(),
        "evidenceLevel": "proxy",
        "summary": f"Amphibian monitoring: {raw.get('Species', 'N/A')}",
        "sourceIds": ["usgs-armi"],
        "tags": ["sentinel", "amphibian", "monitoring"],
        "meta": {
            "species": (raw.get("Species") or "").strip(),
            "scientificName": (raw.get("ScientificName") or "").strip(),
            "taxonGroup": "amphibian",
            "observationType": _infer_observation_type(raw),
            "severity": _classify_severity(abnormality_rate),
            "associatedContaminants": contaminants,
            "armiSiteId": raw.get("SiteId"),
            "abnormalityRate": abnormality_rate,
        },
    }


# ---------------------------------------------------------------------------
# DB load
# ---------------------------------------------------------------------------

def load_to_db(records: list[dict[str, Any]]) -> int:
    """Upsert normalised sentinel records into PostGIS."""
    if not records:
        logger.warning("No sentinel records to load.")
        return 0

    logger.info("Loading %d sentinel records to %s", len(records), DATABASE_URL)
    # Phase 2: implement upsert into sentinel_species table
    logger.info("[scaffold] Database load not yet implemented.")
    return 0


def save_raw(records: list[dict[str, Any]], tag: str = "sentinel") -> str:
    """Persist raw records to RAW_DIR as timestamped JSON."""
    os.makedirs(RAW_DIR, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(RAW_DIR, f"{tag}_{ts}.json")
    with open(path, "w") as fh:
        json.dump(records, fh, indent=2)
    logger.info("Saved raw data to %s", path)
    return path


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    logging.basicConfig(
        level=logging.INFO, format="%(levelname)s %(name)s: %(message)s"
    )
    logger.info("=== Sentinel Species ETL ===")

    fish = fetch_usgs_fish_data()
    amphibians = fetch_amphibian_monitoring()

    if fish:
        save_raw(fish, tag="fish_tissue")
    if amphibians:
        save_raw(amphibians, tag="amphibian_monitoring")

    normalised = normalize_observations(fish, amphibians)
    if normalised:
        loaded = load_to_db(normalised)
        logger.info("Pipeline complete: %d records loaded.", loaded)
    else:
        logger.info("Scaffold only — no data fetched.")


if __name__ == "__main__":
    main()
