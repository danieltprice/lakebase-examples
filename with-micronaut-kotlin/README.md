# Micronaut Kotlin with Databricks Lakebase

This example connects a Micronaut Kotlin application to a Postgres database (e.g. **Databricks Lakebase**).

## Prerequisites

- [JDK 21](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Gradle](https://gradle.org/install/) (or use the included Gradle wrapper)

## Lakebase setup

The datasource in `src/main/resources/application.yml` reads from environment variables:

- **LAKEBASE_JDBC_URL** – Full JDBC URL (e.g. `jdbc:postgresql://host:5432/databricks_postgres?sslmode=require`). For Lakebase, build this URL using a short-lived token from the Databricks OIDC and postgres/credentials APIs (see other examples in this repo). You can run a script that fetches the token and exports `LAKEBASE_JDBC_URL` before starting the app.
- **LAKEBASE_USERNAME** – Database user (Lakebase: your service principal client ID).
- **LAKEBASE_PASSWORD** – Database password (Lakebase: the short-lived token).

Because the token expires, use a script or CI step to refresh it and set these env vars (or restart the app with a new token).

## Run the application

```bash
export LAKEBASE_JDBC_URL="jdbc:postgresql://your-endpoint:5432/databricks_postgres?sslmode=require"
export LAKEBASE_USERNAME="your-client-id"
export LAKEBASE_PASSWORD="your-token"
./gradlew run
```

The application starts on port 8080. Example:

```bash
curl http://localhost:8080/books
curl -X POST http://localhost:8080/books -H "Content-Type: application/json" -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}'
```

## Database migrations

Flyway runs migrations from `src/main/resources/db/migration` on startup.
