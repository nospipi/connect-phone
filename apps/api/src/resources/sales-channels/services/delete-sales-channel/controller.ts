// apps/api/src/resources/sales-channels/services/delete-sales-channel/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DeleteSalesChannelService } from './service';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller('sales-channels')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteSalesChannelController {
  constructor(
    private readonly deleteSalesChannelService: DeleteSalesChannelService
  ) {}

  @Delete(':id')
  async deleteSalesChannel(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ISalesChannel> {
    try {
      const deletedSalesChannel =
        await this.deleteSalesChannelService.deleteSalesChannel(id);
      return deletedSalesChannel;
    } catch (error) {
      console.error('Error deleting sales channel:', error);
      throw error;
    }
  }
}
