// src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannelsService } from './sales-channels.service';
import { SalesChannelsController } from './sales-channels.controller';
import { SalesChannel } from '../../database/entities/sales-channel.entity';
import { Organization } from '../../database/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesChannel, Organization])],
  controllers: [SalesChannelsController],
  providers: [SalesChannelsService],
})
export class SalesChannelsModule {}
