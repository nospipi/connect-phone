import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DbModule } from './db.module';
import { OrganizationAuthGuard } from './guards/organization-auth.guard';
import { SalesChannelsService } from './sales-channels/sales-channels.service';
import { SalesChannelsModule } from './sales-channels/sales-channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    CoreModule,
    UsersModule,
    OrganizationsModule,
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
    {
      provide: APP_GUARD,
      useClass: OrganizationAuthGuard,
    },
    SalesChannelsService,
  ],
})
export class AppModule {}
