// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Organization } from './entities/organization.entity';
import { SalesChannel } from './entities/sales-channel.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [Organization, SalesChannel],
        synchronize: process.env.NODE_ENV !== 'production', // Only for development
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
