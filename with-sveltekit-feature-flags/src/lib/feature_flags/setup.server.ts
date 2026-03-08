import { pool } from '$lib/lakebase';

async function populateFeatureFlags() {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS feature_flags (flagName text PRIMARY KEY, enabled boolean)'
  );
  console.log('✅ Setup database for feature flag');
  await pool.query(
    "INSERT INTO feature_flags (flagName, enabled) VALUES ('fast_payments', true) ON CONFLICT (flagName) DO NOTHING"
  );
  console.log('✅ Setup an enabled feature flag to accept fast payment methods.');
}

populateFeatureFlags();
