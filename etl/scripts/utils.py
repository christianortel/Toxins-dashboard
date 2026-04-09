"""
Shared ETL utilities for the DOWNSTREAM project.

Provides:
  - logging helper
  - HTTP retry wrapper
  - GeoDataFrame helpers
  - simple checkpoint / progress tracking
"""

from __future__ import annotations

import json
import logging
import os
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Callable, Iterator

import requests

LOG_FORMAT = "[%(asctime)s] %(levelname)-8s %(name)s :: %(message)s"


def get_logger(name: str) -> logging.Logger:
    """Return a stderr-bound logger with consistent formatting."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(handler)
        logger.propagate = False
    return logger


def ensure_dir(path: str | Path) -> Path:
    """mkdir -p; returns the resolved Path."""
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def http_get_with_retry(
    url: str,
    *,
    params: dict | None = None,
    headers: dict | None = None,
    max_retries: int = 4,
    backoff: float = 2.0,
    timeout: int = 60,
) -> requests.Response:
    """GET with exponential backoff. Raises on final failure."""
    log = get_logger("http")
    last_exc: Exception | None = None
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=timeout)
            resp.raise_for_status()
            return resp
        except requests.RequestException as exc:
            last_exc = exc
            wait = backoff ** attempt
            log.warning("GET %s failed (attempt %d/%d): %s — sleeping %.1fs",
                        url, attempt + 1, max_retries, exc, wait)
            time.sleep(wait)
    assert last_exc is not None
    raise last_exc


def write_json_records(records: list[dict[str, Any]], dest: str | Path) -> int:
    """Write records as newline-delimited JSON. Returns count written."""
    dest = Path(dest)
    ensure_dir(dest.parent)
    with dest.open("w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, default=str))
            f.write("\n")
    return len(records)


@contextmanager
def step(name: str) -> Iterator[None]:
    """Time a block of work and log when it completes."""
    log = get_logger("step")
    log.info("→ %s", name)
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        log.info("✓ %s (%.2fs)", name, elapsed)


def chunked(seq: list, size: int) -> Iterator[list]:
    """Yield successive `size`-chunks from `seq`."""
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def safe_load_pipeline(name: str, fn: Callable[[], Any]) -> Any:
    """
    Run a fetcher function with logging and basic error containment.
    Returns whatever the fetcher returned, or None on error.
    """
    log = get_logger(name)
    try:
        with step(name):
            return fn()
    except Exception as exc:
        log.error("Pipeline %s failed: %s", name, exc, exc_info=True)
        return None


def is_dry_run() -> bool:
    """Honor DOWNSTREAM_ETL_DRY_RUN=1 in environment."""
    return os.getenv("DOWNSTREAM_ETL_DRY_RUN", "0") == "1"
