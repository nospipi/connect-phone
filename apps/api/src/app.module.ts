// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from 'src/resources/auth/auth.module';
import { ClerkAuthGuard } from './resources/auth/clerk-auth.guard';
import { OrganizationRequiredGuard } from './common/guards/organization-required.guard';
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
    CoreModule, // This now includes OrganizationContextService
    SalesChannelsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    // Optional: Apply OrganizationRequiredGuard globally
    // {
    //   provide: APP_GUARD,
    //   useClass: OrganizationRequiredGuard,
    // },
  ],
})
export class AppModule {}
