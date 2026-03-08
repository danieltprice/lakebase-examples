// Fetches short-lived DB tokens from Databricks for use with the postgres package.
import 'dart:convert';
import 'dart:io';

import 'package:postgres/postgres.dart';

/// Reads required env vars and fetches a token, then returns an [Endpoint] and
/// [ConnectionSettings] for use with [Connection.open].
Future<({Endpoint endpoint, ConnectionSettings settings})> getLakebaseConnection() async {
  final host = Platform.environment['DATABRICKS_HOST'];
  final clientId = Platform.environment['DATABRICKS_CLIENT_ID'];
  final clientSecret = Platform.environment['DATABRICKS_CLIENT_SECRET'];
  final endpoint = Platform.environment['LAKEBASE_ENDPOINT'];
  final dbHost = Platform.environment['LAKEBASE_HOST'];
  final dbPort = int.tryParse(Platform.environment['LAKEBASE_PORT'] ?? '') ?? 5432;
  final dbName = Platform.environment['LAKEBASE_DATABASE'] ?? 'databricks_postgres';

  if (host == null ||
      host.isEmpty ||
      clientId == null ||
      clientSecret == null ||
      endpoint == null ||
      dbHost == null) {
    throw StateError(
      'Set DATABRICKS_HOST, DATABRICKS_CLIENT_ID, DATABRICKS_CLIENT_SECRET, '
      'LAKEBASE_ENDPOINT, LAKEBASE_HOST (and optionally LAKEBASE_PORT, LAKEBASE_DATABASE)',
    );
  }

  final client = HttpClient();
  try {
    // Step A: OIDC token
    final credentials = base64Encode(utf8.encode('$clientId:$clientSecret'));
    final oidcReq = await client.postUrl(Uri.parse('https://$host/oidc/v1/token'));
    oidcReq.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    oidcReq.headers.set('Authorization', 'Basic $credentials');
    oidcReq.write('grant_type=client_credentials&scope=all-apis');
    final oidcRes = await oidcReq.close();
    final oidcBody = await oidcRes.transform(utf8.decoder).join();
    final oidcJson = jsonDecode(oidcBody) as Map<String, dynamic>;
    final accessToken = oidcJson['access_token'] as String?;
    if (accessToken == null) throw StateError('Failed to get OIDC token');

    // Step B: DB token
    final dbReq = await client.postUrl(Uri.parse('https://$host/api/2.0/postgres/credentials'));
    dbReq.headers.set('Content-Type', 'application/json');
    dbReq.headers.set('Authorization', 'Bearer $accessToken');
    dbReq.write(jsonEncode({'endpoint': endpoint}));
    final dbRes = await dbReq.close();
    final dbBody = await dbRes.transform(utf8.decoder).join();
    final dbJson = jsonDecode(dbBody) as Map<String, dynamic>;
    final token = dbJson['token'] as String?;
    if (token == null) throw StateError('Failed to get Postgres credentials');

    return (
      endpoint: Endpoint(
        host: dbHost,
        port: dbPort,
        database: dbName,
        username: clientId,
        password: token,
      ),
      settings: ConnectionSettings(sslMode: SslMode.require),
    );
  } finally {
    client.close();
  }
}
