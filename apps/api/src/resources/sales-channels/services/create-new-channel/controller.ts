// apps/api/src/resources/sales-channels/services/create-new-channel/controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateNewChannelService } from './service';
import { CreateSalesChannelDto } from '../../dto/create-sales-channel.dto';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';

//-------------------------------------------

@Controller('sales-channels')
export class CreateNewChannelController {
  constructor(
    private readonly createNewChannelService: CreateNewChannelService
  ) {}

  @Post('new')
  async createNew(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    console.log('Creating new sales channel with DTO:', createSalesChannelDto);
    const newSalesChannel =
      await this.createNewChannelService.createNewSalesChannel(
        createSalesChannelDto
      );
    console.log('New sales channel created:', newSalesChannel);
    return newSalesChannel;
  }
}
