// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OrganizationCacheInterceptor } from './common/interceptors/organization-cache.interceptor';
import { CacheInvalidationInterceptor } from './common/interceptors/cache-invalidation.interceptor';
import { AuditContextInterceptor } from './common/interceptors/audit-context-interceptor';
import { TransactionRlsInterceptor } from './common/interceptors/transaction-rls.interceptor';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { CmsModule } from './resources/cms/cms.module';

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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const keyv = new KeyvRedis(
          `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        );
        return {
          stores: [keyv],
          // 5 minutes
          //ttl: 300000,
          //test if nothing is passed if it takes any default ttl
        };
      },
    }),
    //redis CACHE MANAGER
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => {
    //     const redisUrl = `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    //     const store = await redisStore({
    //       url: redisUrl,
    //       //we dont need it because we intercept the setting in OrganizationCacheInterceptor
    //       //ttl: 300, // 5 minutes
    //     });
    //     return {
    //       store,
    //       //ttl: 300,
    //     };
    //   },
    // }),
    DatabaseModule,
    AuthModule,
    CoreModule,
    TypeOrmModule.forFeature([UserEntity]),
    CmsModule,
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheLoggingInterceptor,
    // },
  ],
})
export class AppModule {}
