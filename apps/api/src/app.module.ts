import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DbModule } from './db.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ClerkClientProvider,
    // {
    //   provide: APP_GUARD,
    //   useClass: ClerkAuthGuard,
    // },
  ],
})
export class AppModule {}
