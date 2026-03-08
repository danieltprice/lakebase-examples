import { pool } from '$lib/lakebase';

export const isEnabled = async (flagName: string): Promise<boolean> => {
  const { rows } = await pool.query(
    'SELECT enabled FROM feature_flags WHERE flagName = $1',
    [flagName]
  );
  return rows[0]?.enabled ?? false;
};
