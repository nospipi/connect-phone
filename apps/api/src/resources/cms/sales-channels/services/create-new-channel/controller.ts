// apps/api/src/resources/cms/sales-channels/services/create-new-channel/controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateNewChannelService } from './service';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller()
@UseGuards(OrganizationGuard, DbUserGuard)
export class CreateNewChannelController {
  constructor(
    private readonly createNewChannelService: CreateNewChannelService
  ) {}

  @Post('new')
  async createNew(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<ISalesChannel> {
    // Service automatically gets organization from context

    try {
      const newSalesChannel =
        await this.createNewChannelService.createNewSalesChannel(
          createSalesChannelDto
        );

      return newSalesChannel;
    } catch (error) {
      console.error('Error creating sales channel:', error);
      throw error; // Re-throw the error after logging it
    }
  }
}
