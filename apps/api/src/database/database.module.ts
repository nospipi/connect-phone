// apps/api/src/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RlsInitializationService } from './services/rls-initialization.service';
import { dataSourceOptions } from './data-source';

//------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RlsInitializationService],
  exports: [RlsInitializationService],
})
export class DatabaseModule {}
