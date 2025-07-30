// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { SalesChannel } from './entities/sales-channel.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Organization, SalesChannel],
  migrations: ['src/database/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false, // Always false for migrations
  logging: true,
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
