// apps/api/src/resources/sales-channels/services/create-random-channel/controller.ts
import { Controller, Get } from '@nestjs/common';
import { CreateRandomChannelService } from './service';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';

@Controller('sales-channels')
export class CreateRandomChannelController {
  constructor(
    private readonly createRandomChannelService: CreateRandomChannelService
  ) {}

  @Get('create-random')
  async createRandom(): Promise<SalesChannel> {
    console.log('Creating a random sales channel...');
    const newSalesChannel =
      await this.createRandomChannelService.createRandomSalesChannel();
    console.log('Random sales channel created:', newSalesChannel);
    return newSalesChannel;
  }
}
