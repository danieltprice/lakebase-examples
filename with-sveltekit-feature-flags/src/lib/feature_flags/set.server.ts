import { pool } from '$lib/lakebase';

export const setEnabled = async (flagName: string, flagValue: boolean) => {
  await pool.query(
    'UPDATE feature_flags SET enabled = $1 WHERE flagName = $2',
    [flagValue, flagName]
  );
};
