// apps/api/src/database/reset-db.ts
import { AppDataSource } from './data-source';

async function resetDb() {
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase(); // drops all tables
  await AppDataSource.runMigrations(); // re-run your migrations
  console.log('Database reset complete!');
  process.exit(0);
}

resetDb();
