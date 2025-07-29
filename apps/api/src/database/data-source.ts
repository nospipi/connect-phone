// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { SalesChannel } from './entities/sales-channel.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgres://neondb_owner:npg_bLanm9lyor0v@ep-billowing-frog-a2q2l4h5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
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
