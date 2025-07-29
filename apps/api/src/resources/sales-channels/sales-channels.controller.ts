// src/resources/sales-channels/sales-channels.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { SalesChannel } from '../../database/entities/sales-channel.entity';

@Controller('sales-channels')
export class SalesChannelsController {
  constructor(private readonly salesChannelsService: SalesChannelsService) {}

  @Get('organization/:organizationId')
  async findAllByOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number
  ): Promise<SalesChannel[]> {
    return this.salesChannelsService.findAllByOrganization(organizationId);
  }
}
