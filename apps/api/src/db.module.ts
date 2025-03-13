import { Module, Global } from '@nestjs/common';
import * as db from 'db';
export * from 'db';

// Provider definition
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
