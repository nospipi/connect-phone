// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { SalesChannel } from './entities/sales-channel.entity';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Organization, SalesChannel, User],
  migrations: ['src/database/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false, // Always false for migrations
  logging: true,
});

// Optional helper for your app runtime (not needed for CLI)
export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  }
}
