// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { SalesChannelsModule } from './resources/sales-channels/sales-channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CoreModule, // This includes OrganizationContextService
    SalesChannelsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard, // Only authentication is global
    },
    // ✅ NO global organization guard - you pick which controllers need it
  ],
})
export class AppModule {}
