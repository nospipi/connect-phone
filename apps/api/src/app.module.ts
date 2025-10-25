// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheLoggingInterceptor } from './common/interceptors/cache-logging.interceptor';
import { OrganizationCacheInterceptor } from './common/interceptors/organization-cache.interceptor';
import { CacheInvalidationInterceptor } from './common/interceptors/cache-invalidation.interceptor';
import { AuditContextInterceptor } from './common/interceptors/audit-context-interceptor';
import { TransactionRlsInterceptor } from './common/interceptors/transaction-rls.interceptor';
import { DatabaseModule } from './database/database.module';
import { SalesChannelsModule } from './resources/sales-channels/sales-channels.module';
import { UsersModule } from './resources/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { AuditLogsModule } from './resources/audit-logs/audit-logs.module';
import { UserInvitationsModule } from './resources/user-invitations/user-invitations.module';
import { CountriesModule } from './resources/countries/countries.module';
import { OrganizationsModule } from './resources/organizations/organizations.module';
import { DateRangesModule } from './resources/date-ranges/date-ranges.module';
import { PricesModule } from './resources/prices/prices.module';
import { MediaModule } from './resources/media/media.module';
import { OfferInclusionsModule } from './resources/offer-inclusions/offer-inclusions.module';
import { OfferExclusionsModule } from './resources/offer-exclusions/offer-exclusions.module';
import { EsimOffersModule } from './resources/esim-offers/esim-offers.module';

//------------------------------------------------------------

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //in RAM
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: 300000, // 5 minutes
    //   max: 200, // maximum number of items in cache
    // }),
    //redis KEYV cache
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => {
    //     const redisUrl = `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

    //     return {
    //       stores: [new KeyvRedis(redisUrl)],
    //       ttl: 300000,
    //     };
    //   },
    // }),
    //redis CACHE MANAGER
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisUrl = `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
        const store = await redisStore({
          url: redisUrl,
          ttl: 300, // 5 minutes
        });
        return { store, ttl: 300 };
      },
    }),
    DatabaseModule,
    AuthModule,
    CoreModule,
    SalesChannelsModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuditLogsModule,
    UserInvitationsModule,
    CountriesModule,
    OrganizationsModule,
    DateRangesModule,
    PricesModule,
    MediaModule,
    EsimOffersModule,
    OfferInclusionsModule,
    OfferExclusionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionRlsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInvalidationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OrganizationCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheLoggingInterceptor,
    },
  ],
})
export class AppModule {}
