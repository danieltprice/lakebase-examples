import { Module } from '@nestjs/common';
import { pool } from './lakebase';

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: pool,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
