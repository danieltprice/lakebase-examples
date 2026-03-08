# Fetches short-lived DB tokens from Databricks; used at startup for FastAPI.
import base64
import json
import os
from urllib.request import Request, urlopen


def get_password() -> str:
    host = os.environ["DATABRICKS_HOST"]
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
    return data2["token"]


def get_connection_url() -> str:
    """Returns postgresql+asyncpg URL for SQLAlchemy (used at app startup)."""
    user = os.environ["DATABRICKS_CLIENT_ID"]
    password = get_password()
    host = os.environ["LAKEBASE_HOST"]
    port = os.getenv("LAKEBASE_PORT", "5432")
    database = os.getenv("LAKEBASE_DATABASE", "databricks_postgres")
    # Escape password for URL
    from urllib.parse import quote_plus
    password = quote_plus(password)
    return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}"
