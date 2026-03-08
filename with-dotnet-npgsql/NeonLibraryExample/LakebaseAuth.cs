// Fetches short-lived DB tokens from Databricks; refreshes automatically before expiry.
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Npgsql;

namespace NeonLibraryExample;

public static class LakebaseAuth
{
    private const double BufferMinutes = 2;
    private static readonly HttpClient HttpClient = new();
    private static string? _cachedToken;
    private static DateTime _expiresAt;
    private static readonly SemaphoreSlim RefreshLock = new(1, 1);

    public static async Task<string> GetPasswordAsync(CancellationToken cancellationToken = default)
    {
        var buffer = TimeSpan.FromMinutes(BufferMinutes);
        if (_cachedToken != null && DateTime.UtcNow < _expiresAt - buffer)
            return _cachedToken;

        await RefreshLock.WaitAsync(cancellationToken);
        try
        {
            if (_cachedToken != null && DateTime.UtcNow < _expiresAt - buffer)
                return _cachedToken;
            await RefreshTokenAsync(cancellationToken);
            return _cachedToken!;
        }
        finally
        {
            RefreshLock.Release();
        }
    }

    public static async Task<string> GetConnectionStringAsync(CancellationToken cancellationToken = default)
    {
        var password = await GetPasswordAsync(cancellationToken);
        var host = Environment.GetEnvironmentVariable("LAKEBASE_HOST") ?? "";
        var port = int.Parse(Environment.GetEnvironmentVariable("LAKEBASE_PORT") ?? "5432");
        var database = Environment.GetEnvironmentVariable("LAKEBASE_DATABASE") ?? "databricks_postgres";
        var user = Environment.GetEnvironmentVariable("DATABRICKS_CLIENT_ID") ?? "";
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Port = port,
            Database = database,
            Username = user,
            Password = password,
            SslMode = SslMode.Require
        };
        return builder.ConnectionString;
    }

    private static async Task RefreshTokenAsync(CancellationToken cancellationToken)
    {
        var host = Environment.GetEnvironmentVariable("DATABRICKS_HOST")
            ?? throw new InvalidOperationException("DATABRICKS_HOST is not set.");
        var clientId = Environment.GetEnvironmentVariable("DATABRICKS_CLIENT_ID")
            ?? throw new InvalidOperationException("DATABRICKS_CLIENT_ID is not set.");
        var clientSecret = Environment.GetEnvironmentVariable("DATABRICKS_CLIENT_SECRET")
            ?? throw new InvalidOperationException("DATABRICKS_CLIENT_SECRET is not set.");
        var endpoint = Environment.GetEnvironmentVariable("LAKEBASE_ENDPOINT")
            ?? throw new InvalidOperationException("LAKEBASE_ENDPOINT is not set.");

        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

        // Step A: OIDC token
        using var oidcRequest = new HttpRequestMessage(HttpMethod.Post, $"https://{host}/oidc/v1/token");
        oidcRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        oidcRequest.Content = new StringContent(
            "grant_type=client_credentials&scope=all-apis",
            Encoding.UTF8,
            "application/x-www-form-urlencoded");
        using var oidcResponse = await HttpClient.SendAsync(oidcRequest, cancellationToken);
        oidcResponse.EnsureSuccessStatusCode();
        var oidcJson = await oidcResponse.Content.ReadAsStringAsync(cancellationToken);
        var oidcDoc = JsonDocument.Parse(oidcJson);
        var accessToken = oidcDoc.RootElement.GetProperty("access_token").GetString()
            ?? throw new InvalidOperationException("OIDC response missing access_token.");

        // Step B: DB token
        using var dbRequest = new HttpRequestMessage(HttpMethod.Post, $"https://{host}/api/2.0/postgres/credentials");
        dbRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        dbRequest.Content = new StringContent(
            JsonSerializer.Serialize(new { endpoint }),
            Encoding.UTF8,
            "application/json");
        using var dbResponse = await HttpClient.SendAsync(dbRequest, cancellationToken);
        dbResponse.EnsureSuccessStatusCode();
        var dbJson = await dbResponse.Content.ReadAsStringAsync(cancellationToken);
        var dbDoc = JsonDocument.Parse(dbJson);
        _cachedToken = dbDoc.RootElement.GetProperty("token").GetString()
            ?? throw new InvalidOperationException("Postgres credentials response missing token.");
        var expireTime = dbDoc.RootElement.GetProperty("expire_time").GetString()
            ?? throw new InvalidOperationException("Postgres credentials response missing expire_time.");
        _expiresAt = DateTime.Parse(expireTime, null, System.Globalization.DateTimeStyles.RoundtripKind);
    }
}
