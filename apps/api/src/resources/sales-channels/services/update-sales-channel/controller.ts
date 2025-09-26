// apps/api/src/resources/sales-channels/services/update-sales-channel/controller.ts
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
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

//-------------------------------------------

@Controller('sales-channels')
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
    console.log('updateSalesChannel Controller - ID:', id);

    // Set the ID from the URL parameter
    updateSalesChannelDto.id = id;

    try {
      const updatedSalesChannel =
        await this.updateSalesChannelService.updateSalesChannel(
          updateSalesChannelDto
        );
      console.log('Sales channel updated successfully:', updatedSalesChannel);
      return updatedSalesChannel;
    } catch (error) {
      console.error('Error updating sales channel:', error);
      throw error;
    }
  }
}
