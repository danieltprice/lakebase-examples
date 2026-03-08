<?php

namespace App;

use Illuminate\Support\Facades\Http;

/**
 * Fetches short-lived DB tokens from Databricks and returns a PostgreSQL connection URL.
 */
class LakebaseAuth
{
    public static function getConnectionUrl(): string
    {
        $host = config('services.lakebase.databricks_host') ?: env('DATABRICKS_HOST');
        $clientId = config('services.lakebase.client_id') ?: env('DATABRICKS_CLIENT_ID');
        $clientSecret = config('services.lakebase.client_secret') ?: env('DATABRICKS_CLIENT_SECRET');
        $endpoint = config('services.lakebase.endpoint') ?: env('LAKEBASE_ENDPOINT');
        $dbHost = config('services.lakebase.host') ?: env('LAKEBASE_HOST');
        $dbPort = config('services.lakebase.port') ?: env('LAKEBASE_PORT') ?: '5432';
        $dbName = config('services.lakebase.database') ?: env('LAKEBASE_DATABASE') ?: 'databricks_postgres';

        $credentials = base64_encode("{$clientId}:{$clientSecret}");
        $oidc = Http::withHeaders([
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Authorization' => "Basic {$credentials}",
        ])->post("https://{$host}/oidc/v1/token", [
            'grant_type' => 'client_credentials',
            'scope' => 'all-apis',
        ])->json();
        $accessToken = $oidc['access_token'] ?? null;
        if (!$accessToken) {
            throw new \RuntimeException('Failed to get OIDC token from Databricks');
        }

        $cred = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer {$accessToken}",
        ])->post("https://{$host}/api/2.0/postgres/credentials", [
            'endpoint' => $endpoint,
        ])->json();
        $token = $cred['token'] ?? null;
        if (!$token) {
            throw new \RuntimeException('Failed to get Postgres credentials from Databricks');
        }

        $user = rawurlencode($clientId);
        $password = rawurlencode($token);
        return "postgresql://{$user}:{$password}@{$dbHost}:{$dbPort}/{$dbName}?sslmode=require";
    }
}
