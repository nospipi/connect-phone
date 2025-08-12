// apps/api/src/resources/sales-channels/services/create-random-channel/controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateRandomChannelService } from './service';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';

//-------------------------------------------

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

  @Post()
  async create(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    console.log('Creating sales channel with DTO:', createSalesChannelDto);
    const newSalesChannel =
      await this.createRandomChannelService.createSalesChannel(
        createSalesChannelDto
      );
    console.log('Sales channel created:', newSalesChannel);
    return newSalesChannel;
  }
}
