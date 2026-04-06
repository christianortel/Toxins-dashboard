"""
Fetch EPA Toxics Release Inventory data.

This is a scaffold for the TRI ETL pipeline.
Actual data fetching will be implemented during Phase 2.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config.settings import DATABASE_URL, RAW_DIR


def fetch_tri_data(year: int = 2022):
    """Fetch TRI data for a given reporting year."""
    print(f"[TRI] Fetching data for year {year}...")
    print(f"[TRI] Database: {DATABASE_URL}")
    print(f"[TRI] Output: {RAW_DIR}")
    # Phase 2: Implement actual data fetching
    print("[TRI] Scaffold only — no data fetched.")


if __name__ == "__main__":
    fetch_tri_data()
