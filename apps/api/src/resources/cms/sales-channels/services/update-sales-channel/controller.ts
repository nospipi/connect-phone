// apps/api/src/resources/cms/sales-channels/services/update-sales-channel/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateSalesChannelService } from './service';
import { UpdateSalesChannelDto } from './update-sales-channel.dto';
import { ISalesChannel } from '@connect-phone/shared-types';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { OrganizationGuard } from '@/common/guards/organization.guard';

//-------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class UpdateSalesChannelController {
  constructor(
    private readonly updateSalesChannelService: UpdateSalesChannelService
  ) {}

  @Put(':id')
  async updateSalesChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesChannelDto: UpdateSalesChannelDto
  ): Promise<ISalesChannel> {
    // Set the ID from the URL parameter
    updateSalesChannelDto.id = id;

    try {
      const updatedSalesChannel =
        await this.updateSalesChannelService.updateSalesChannel(
          updateSalesChannelDto
        );

      return updatedSalesChannel;
    } catch (error) {
      console.error('Error updating sales channel:', error);
      throw error;
    }
  }
}
