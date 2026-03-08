# Fetches short-lived DB tokens from Databricks; refreshes automatically before expiry.
import base64
import json
import os
import threading
import time
from datetime import datetime, timezone
from typing import Optional
from urllib.request import Request, urlopen

_lock = threading.Lock()
_cached_token: Optional[str] = None
_expires_at: float = 0.0


def _refresh() -> None:
    global _cached_token, _expires_at
    host = os.environ["DATABRICKS_HOST"].rstrip("/")
    client_id = os.environ["DATABRICKS_CLIENT_ID"]
    client_secret = os.environ["DATABRICKS_CLIENT_SECRET"]
    endpoint = os.environ["LAKEBASE_ENDPOINT"]

    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    req = Request(
        f"https://{host}/oidc/v1/token",
        data="grant_type=client_credentials&scope=all-apis".encode(),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {credentials}",
        },
        method="POST",
    )
    with urlopen(req) as res:
        data = json.loads(res.read().decode())
    access_token = data["access_token"]

    req2 = Request(
        f"https://{host}/api/2.0/postgres/credentials",
        data=json.dumps({"endpoint": endpoint}).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
        method="POST",
    )
    with urlopen(req2) as res:
        data2 = json.loads(res.read().decode())
    _cached_token = data2["token"]
    expire_str = data2["expire_time"].rstrip("Z")
    _expires_at = datetime.fromisoformat(expire_str).replace(tzinfo=timezone.utc).timestamp()


def get_password() -> str:
    global _cached_token, _expires_at
    with _lock:
        buffer = float(os.getenv("LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES", "2")) * 60
        if _cached_token is None or time.time() >= _expires_at - buffer:
            _refresh()
        return _cached_token


def get_connection_kwargs() -> dict:
    return {
        "host": os.environ["LAKEBASE_HOST"],
        "port": int(os.getenv("LAKEBASE_PORT", "5432")),
        "dbname": os.getenv("LAKEBASE_DATABASE", "databricks_postgres"),
        "user": os.environ["DATABRICKS_CLIENT_ID"],
        "password": get_password(),
        "sslmode": "require",
    }
