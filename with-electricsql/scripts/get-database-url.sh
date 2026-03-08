#!/usr/bin/env bash
# Outputs a PostgreSQL connection string using a short-lived token from Databricks.
# Usage: export DATABASE_URL=$(./scripts/get-database-url.sh)
# Requires: DATABRICKS_HOST, DATABRICKS_CLIENT_ID, DATABRICKS_CLIENT_SECRET,
#           LAKEBASE_ENDPOINT, LAKEBASE_HOST, and optionally LAKEBASE_PORT, LAKEBASE_DATABASE.

set -e

: "${DATABRICKS_HOST:?Set DATABRICKS_HOST}"
: "${DATABRICKS_CLIENT_ID:?Set DATABRICKS_CLIENT_ID}"
: "${DATABRICKS_CLIENT_SECRET:?Set DATABRICKS_CLIENT_SECRET}"
: "${LAKEBASE_ENDPOINT:?Set LAKEBASE_ENDPOINT}"
: "${LAKEBASE_HOST:?Set LAKEBASE_HOST}"

LAKEBASE_PORT="${LAKEBASE_PORT:-5432}"
LAKEBASE_DATABASE="${LAKEBASE_DATABASE:-databricks_postgres}"

CREDS=$(echo -n "${DATABRICKS_CLIENT_ID}:${DATABRICKS_CLIENT_SECRET}" | base64)
OIDC_RESP=$(curl -sS -X POST "https://${DATABRICKS_HOST}/oidc/v1/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic ${CREDS}" \
  -d "grant_type=client_credentials&scope=all-apis")
ACCESS_TOKEN=$(python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" <<< "$OIDC_RESP")

CRED_RESP=$(curl -sS -X POST "https://${DATABRICKS_HOST}/api/2.0/postgres/credentials" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{\"endpoint\":\"${LAKEBASE_ENDPOINT}\"}")
TOKEN=$(python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" <<< "$CRED_RESP")

USER_ENC=$(printf '%s' "$DATABRICKS_CLIENT_ID" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote_plus(sys.stdin.read().strip()))")
PASS_ENC=$(printf '%s' "$TOKEN" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote_plus(sys.stdin.read().strip()))")
echo "postgresql://${USER_ENC}:${PASS_ENC}@${LAKEBASE_HOST}:${LAKEBASE_PORT}/${LAKEBASE_DATABASE}?sslmode=require"
