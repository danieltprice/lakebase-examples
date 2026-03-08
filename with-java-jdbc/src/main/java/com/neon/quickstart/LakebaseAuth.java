package com.neon.quickstart;

import com.google.gson.Gson;
import io.github.cdimascio.dotenv.Dotenv;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

/**
 * Fetches short-lived DB tokens from Databricks and builds a JDBC connection string.
 */
public final class LakebaseAuth {

    private LakebaseAuth() {}

    /** Use when env vars are loaded from .env via Dotenv. */
    public static String getConnectionString(Dotenv dotenv) throws Exception {
        String host = dotenv.get("DATABRICKS_HOST");
        String clientId = dotenv.get("DATABRICKS_CLIENT_ID");
        String clientSecret = dotenv.get("DATABRICKS_CLIENT_SECRET");
        String endpoint = dotenv.get("LAKEBASE_ENDPOINT");
        String dbHost = dotenv.get("LAKEBASE_HOST");
        String dbPort = dotenv.get("LAKEBASE_PORT");
        if (dbPort == null || dbPort.isEmpty()) dbPort = "5432";
        String dbName = dotenv.get("LAKEBASE_DATABASE");
        if (dbName == null || dbName.isEmpty()) dbName = "databricks_postgres";

        if (host == null || clientId == null || clientSecret == null || endpoint == null || dbHost == null) {
            throw new IllegalStateException("Set DATABRICKS_HOST, DATABRICKS_CLIENT_ID, DATABRICKS_CLIENT_SECRET, LAKEBASE_ENDPOINT, LAKEBASE_HOST in .env");
        }

        HttpClient client = HttpClient.newHttpClient();

        // Step A: OIDC token
        String credentials = java.util.Base64.getEncoder()
            .encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8));
        HttpRequest oidcReq = HttpRequest.newBuilder()
            .uri(URI.create("https://" + host + "/oidc/v1/token"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Authorization", "Basic " + credentials)
            .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials&scope=all-apis"))
            .build();
        HttpResponse<String> oidcRes = client.send(oidcReq, HttpResponse.BodyHandlers.ofString());
        String accessToken = new Gson().fromJson(oidcRes.body(), OidcResponse.class).access_token;

        // Step B: DB token
        String body = "{\"endpoint\":\"" + endpoint.replace("\"", "\\\"") + "\"}";
        HttpRequest dbReq = HttpRequest.newBuilder()
            .uri(URI.create("https://" + host + "/api/2.0/postgres/credentials"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + accessToken)
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
        HttpResponse<String> dbRes = client.send(dbReq, HttpResponse.BodyHandlers.ofString());
        String token = new Gson().fromJson(dbRes.body(), CredResponse.class).token;

        String user = URLEncoder.encode(clientId, StandardCharsets.UTF_8);
        String password = URLEncoder.encode(token, StandardCharsets.UTF_8);
        return "jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName
            + "?user=" + user + "&password=" + password + "&sslmode=require";
    }

    private static class OidcResponse {
        String access_token;
    }

    private static class CredResponse {
        String token;
    }
}
