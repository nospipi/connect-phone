import { Module } from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { SalesChannelsController } from './sales-channels.controller';

@Module({
  controllers: [SalesChannelsController],
  providers: [SalesChannelsService],
})
export class SalesChannelsModule {}
