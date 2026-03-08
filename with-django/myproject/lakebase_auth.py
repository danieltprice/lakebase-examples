"""
Lakebase token rotation for Django + psycopg2.

Fetches a short-lived Postgres password from Databricks automatically.
No manual rotation needed — the token is refreshed lazily before it expires.
"""

import base64
import json
import os
import threading
import time
from typing import Optional
from urllib import request as urllib_request

_lock = threading.Lock()
_cached_token: Optional[str] = None
_expires_at: float = 0.0


def _fetch_oidc_token() -> str:
    """Step A: Exchange service principal credentials for a Databricks API token."""
    host = os.environ["DATABRICKS_HOST"]
    client_id = os.environ["DATABRICKS_CLIENT_ID"]
    client_secret = os.environ["DATABRICKS_CLIENT_SECRET"]

    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    url = f"https://{host}/oidc/v1/token"
    data = b"grant_type=client_credentials&scope=all-apis"

    req = urllib_request.Request(
        url,
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
    """Step B: Exchange the API token for a short-lived Postgres password."""
    host = os.environ["DATABRICKS_HOST"]
    endpoint = os.environ["LAKEBASE_ENDPOINT"]

    url = f"https://{host}/api/2.0/postgres/credentials"
    data = json.dumps({"endpoint": endpoint}).encode()

    req = urllib_request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}",
        },
        method="POST",
    )
    with urllib_request.urlopen(req) as resp:
        body = json.loads(resp.read())
        from datetime import datetime, timezone
        expire_str = body["expire_time"].rstrip("Z")
        expires_at = datetime.fromisoformat(expire_str).replace(
            tzinfo=timezone.utc
        ).timestamp()
        return body["token"], expires_at


def _refresh() -> None:
    """Fetch a new token and update the module-level cache. Caller holds _lock."""
    global _cached_token, _expires_at
    api_token = _fetch_oidc_token()
    token, expires_at = _fetch_db_token(api_token)
    _cached_token = token
    _expires_at = expires_at


def get_password() -> str:
    """
    Return the current Lakebase Postgres password, refreshing lazily if needed.
    Thread-safe; concurrent callers share a single in-flight refresh.
    """
    global _cached_token, _expires_at
    with _lock:
        buffer_secs = float(os.getenv("LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES", "2")) * 60
        if _cached_token is None or time.time() >= _expires_at - buffer_secs:
            _refresh()
        return _cached_token
