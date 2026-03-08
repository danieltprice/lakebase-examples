# Getting started with Databricks Lakebase and Java (JDBC)

This example connects to Lakebase from Java using the PostgreSQL JDBC driver. `LakebaseAuth.getConnectionString(Dotenv)` fetches a short-lived token from the Databricks API and returns a JDBC connection string. Load `.env` with Dotenv and pass it to get the connection string.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-java-jdbc ./with-java-jdbc
cd with-java-jdbc
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
mvn compile
mvn exec:java -Dexec.mainClass="com.neon.quickstart.CreateTable"
mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
mvn exec:java -Dexec.mainClass="com.neon.quickstart.UpdateData"
mvn exec:java -Dexec.mainClass="com.neon.quickstart.DeleteData"
```
