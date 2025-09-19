// apps/api/src/resources/sales-channels/services/create-new-channel/controller.ts
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
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller('sales-channels')
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

    console.log('createNew Controller:', createSalesChannelDto);

    try {
      const newSalesChannel =
        await this.createNewChannelService.createNewSalesChannel(
          createSalesChannelDto
        );

      console.log('New sales channel created:', newSalesChannel);
      return newSalesChannel;
    } catch (error) {
      console.error('Error creating sales channel:', error);
      throw error; // Re-throw the error after logging it
    }
  }

  /**
   * Get all sales channels for current organization
   */
  @Get()
  async getAllForOrganization(): Promise<ISalesChannel[]> {
    return this.createNewChannelService.getAllForCurrentOrganization();
  }

  /**
   * Get a specific sales channel
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ISalesChannel> {
    return this.createNewChannelService.findOneForCurrentOrganization(id);
  }

  /**
   * Update a sales channel
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateSalesChannelDto>
  ): Promise<ISalesChannel> {
    return this.createNewChannelService.updateForCurrentOrganization(
      id,
      updateDto
    );
  }

  /**
   * Delete a sales channel
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    await this.createNewChannelService.removeForCurrentOrganization(id);

    return { message: `Sales channel ${id} deleted successfully` };
  }
}
