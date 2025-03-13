import { Module, Global } from '@nestjs/common';
import * as db from '@nospipi/database';
export type { User, Organization } from '@nospipi/database';
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
