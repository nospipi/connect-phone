// apps/api/src/database/data-source.ts
import { DataSource } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { SalesChannelEntity } from './entities/sales-channel.entity';
import { UserEntity } from './entities/user.entity';
import { UserOrganizationEntity } from './entities/user-organization.entity';
import { AuditLogEntryEntity } from './entities/audit-log.entity';
import { UserInvitationEntity } from './entities/user-invitation.entity';
import { CountryEntity } from './entities/country.entity';
import { PriceEntity } from './entities/price.entity';
import { DateRangeEntity } from './entities/date-range.entity';
import { AuditLogSubscriber } from './subscribers/audit-log.subscriber';
import { UserInvitationSubscriber } from './subscribers/user-invitation.subscriber';
import * as dotenv from 'dotenv';
dotenv.config();

//-----------------------------------------------------------------------------

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    OrganizationEntity,
    SalesChannelEntity,
    UserEntity,
    UserOrganizationEntity,
    AuditLogEntryEntity,
    UserInvitationEntity,
    CountryEntity,
    DateRangeEntity,
    PriceEntity,
  ],
  subscribers: [AuditLogSubscriber, UserInvitationSubscriber],
  migrations: ['src/database/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  logging: true,
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  }
}
