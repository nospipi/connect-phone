import { Module, Global } from '@nestjs/common';
import * as db from 'db/dist/queries/index.js';
export * from 'db/dist';

const DB_PROVIDER = {
  provide: 'DB',
  useValue: db,
};

@Global()
@Module({
  providers: [DB_PROVIDER],
  exports: [DB_PROVIDER],
})
export class DbModule {}
