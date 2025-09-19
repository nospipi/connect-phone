// src/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationEntity } from './entities/organization.entity';
import { SalesChannelEntity } from './entities/sales-channel.entity';
import { UserEntity } from './entities/user.entity';
import { UserOrganizationEntity } from './entities/user-organization.entity';
import { AuditLogEntryEntity } from './entities/audit-log.entity';
import { UserInvitationEntity } from './entities/user-invitation.entity';
import { AuditLogSubscriber } from './subscribers/audit-log.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [
          OrganizationEntity,
          SalesChannelEntity,
          UserEntity,
          UserOrganizationEntity,
          AuditLogEntryEntity,
          UserInvitationEntity,
        ],
        subscribers: [AuditLogSubscriber],
        synchronize: process.env.NODE_ENV !== 'production',
        ssl: {
          rejectUnauthorized: false,
        },
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
