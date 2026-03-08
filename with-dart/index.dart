import 'package:postgres/postgres.dart';
import 'package:with_dart/lakebase.dart';

void main() async {
  final connParams = await getLakebaseConnection();
  final conn = await Connection.open(
    connParams.endpoint,
    settings: connParams.settings,
  );
  try {
    final result = await conn.execute("SELECT * from playing_with_neon;");
    print(result);
  } finally {
    await conn.close();
  }
}
