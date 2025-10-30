// apps/api/src/resources/sales-channels/services/get-sales-channel-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetSalesChannelByIdService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { ISalesChannel } from '@connect-phone/shared-types';

//--------------------------------------------------------------------------------

@Controller('sales-channels')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetSalesChannelByIdController {
  constructor(
    private readonly getSalesChannelByIdService: GetSalesChannelByIdService
  ) {}

  @Get(':id')
  async getSalesChannelById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ISalesChannel> {
    try {
      const salesChannel =
        await this.getSalesChannelByIdService.getSalesChannelById(id);
      return salesChannel;
    } catch (error) {
      console.error('Error retrieving sales channel by ID:', error);
      throw error;
    }
  }
}
