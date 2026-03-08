"""
Lakebase token fetcher with lazy refresh.

Fetches short-lived Postgres credentials from the Databricks API using a
long-lived service principal. Caches the token in memory and refreshes only
when the token is expired or within LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES of
expiry. No background timer — refresh happens on demand.

Required env vars:
  DATABRICKS_HOST         e.g. dbc-xxxx.cloud.databricks.com
  DATABRICKS_CLIENT_ID    service principal client ID
  DATABRICKS_CLIENT_SECRET service principal secret
  LAKEBASE_ENDPOINT       projects/<id>/branches/<id>/endpoints/<id>
  LAKEBASE_HOST           Postgres host for the Lakebase endpoint

Optional:
  LAKEBASE_PORT                           default 5432
  LAKEBASE_DATABASE                       default databricks_postgres
  LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES   default 2
"""

import base64
import json
import os
import threading
import time
from typing import Optional
from urllib import parse, request as urllib_request

_lock = threading.Lock()
_cached_token: Optional[str] = None
_expires_at: float = 0.0  # Unix timestamp


def _buffer_seconds() -> float:
    return float(os.getenv("LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES", "2")) * 60


def _fetch_api_token() -> str:
    """Step A: Exchange service principal credentials for an API access token."""
    host = os.environ["DATABRICKS_HOST"].rstrip("/")
    client_id = os.environ["DATABRICKS_CLIENT_ID"]
    client_secret = os.environ["DATABRICKS_CLIENT_SECRET"]

    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    data = parse.urlencode({"grant_type": "client_credentials", "scope": "all-apis"}).encode()

    req = urllib_request.Request(
        f"https://{host}/oidc/v1/token",
        data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {credentials}",
        },
        method="POST",
    )
    with urllib_request.urlopen(req) as resp:
        return json.loads(resp.read())["access_token"]


def _fetch_db_token(api_token: str) -> tuple:
    """Step B: Exchange API token for a short-lived Postgres credential."""
    host = os.environ["DATABRICKS_HOST"].rstrip("/")
    endpoint = os.environ["LAKEBASE_ENDPOINT"]

    data = json.dumps({"endpoint": endpoint}).encode()
    req = urllib_request.Request(
        f"https://{host}/api/2.0/postgres/credentials",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}",
        },
        method="POST",
    )
    with urllib_request.urlopen(req) as resp:
        body = json.loads(resp.read())

    token = body["token"]
    from datetime import datetime, timezone
    expire_str = body["expire_time"].rstrip("Z")
    expires_at = datetime.fromisoformat(expire_str).replace(tzinfo=timezone.utc).timestamp()
    return token, expires_at


def _refresh() -> None:
    global _cached_token, _expires_at
    api_token = _fetch_api_token()
    token, expires_at = _fetch_db_token(api_token)
    _cached_token = token
    _expires_at = expires_at


def get_password() -> str:
    """Return the current Lakebase DB token, refreshing lazily if needed."""
    global _cached_token, _expires_at
    with _lock:
        if _cached_token is None or time.time() >= _expires_at - _buffer_seconds():
            _refresh()
        return _cached_token


def get_connection_kwargs() -> dict:
    """
    Return psycopg connection keyword arguments for Lakebase.

    Usage:
        import psycopg
        from lakebase_auth import get_connection_kwargs
        with psycopg.connect(**get_connection_kwargs()) as conn:
            ...
    """
    return {
        "host": os.environ["LAKEBASE_HOST"],
        "port": int(os.getenv("LAKEBASE_PORT", "5432")),
        "dbname": os.getenv("LAKEBASE_DATABASE", "databricks_postgres"),
        "user": os.environ["DATABRICKS_CLIENT_ID"],
        "password": get_password(),
        "sslmode": "require",
    }
