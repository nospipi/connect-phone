// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from './auth/auth.module';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuditContextInterceptor } from './common/interceptors/audit-context-interceptor';
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

//-----------------------------------------------------------------------------

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
})
export class AppModule {}
