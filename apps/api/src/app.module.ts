import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './common/core/core.module';
import { ClerkClientProvider } from 'src/common/providers/clerk-client.provider';
import { AuthModule } from 'src/resources/auth/auth.module';
import { ClerkAuthGuard } from './resources/auth/clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
//import { OrganizationAuthGuard } from './common/guards/organization-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: OrganizationAuthGuard,
    // },
  ],
})
export class AppModule {}
