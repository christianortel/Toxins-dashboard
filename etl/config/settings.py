"""ETL configuration settings."""

import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://downstream:downstream@localhost:5432/downstream"
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

EPA_TRI_BASE_URL = "https://data.epa.gov/efservice"
EPA_FRS_BASE_URL = "https://data.epa.gov/efservice"

SRID = 4326
