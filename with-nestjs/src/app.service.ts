import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly pool: Pool) {}

  async getTable(name: string): Promise<any[]> {
    const quoted = '"' + name.replace(/"/g, '""') + '"';
    const result = await this.pool.query(`SELECT * FROM ${quoted}`);
    return result.rows;
  }
}
