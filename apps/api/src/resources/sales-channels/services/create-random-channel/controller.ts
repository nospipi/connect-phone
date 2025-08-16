// apps/api/src/resources/sales-channels/services/create-random-channel/controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateRandomChannelService } from './service';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import { RequiresOrganization } from '@/common/decorators/requires-organization.decorator';
import { OrganizationRequiredGuard } from '@/common/guards/organization-required.guard';
import {
  RequiredOrganization,
  CurrentDbUser,
} from '@/common/decorators/current-organization.decorator';
import { Public } from '@/common/decorators/public.decorator';

//-------------------------------------------

@Controller('sales-channels')
@UseGuards(OrganizationRequiredGuard) // Apply guard to entire controller
export class CreateRandomChannelController {
  constructor(
    private readonly createRandomChannelService: CreateRandomChannelService
  ) {}

  /**
   * Creates a random sales channel for the current user's organization
   */
  @Get('create-random')
  @RequiresOrganization()
  async createRandom(
    @RequiredOrganization() organization: Organization,
    @CurrentDbUser() user: User | null
  ): Promise<SalesChannel> {
    console.log(
      `Creating a random sales channel for organization: ${organization.name}`
    );
    console.log(`Requested by user: ${user?.email || 'Unknown'}`);

    const newSalesChannel =
      await this.createRandomChannelService.createRandomSalesChannel();
    console.log('Random sales channel created:', newSalesChannel);
    return newSalesChannel;
  }

  /**
   * Creates a sales channel for the current user's organization
   */
  @Post()
  @RequiresOrganization()
  async create(
    @Body() createSalesChannelDto: CreateSalesChannelDto,
    @RequiredOrganization() organization: Organization,
    @CurrentDbUser() user: User | null
  ): Promise<SalesChannel> {
    console.log(
      `Creating sales channel for organization: ${organization.name}`
    );
    console.log('Sales channel DTO:', createSalesChannelDto);
    console.log(`Requested by user: ${user?.email || 'Unknown'}`);

    const newSalesChannel =
      await this.createRandomChannelService.createSalesChannel(
        createSalesChannelDto
      );
    console.log('Sales channel created:', newSalesChannel);
    return newSalesChannel;
  }

  /**
   * Public endpoint for testing - creates random sales channel for any organization
   */
  @Public()
  @Get('create-random-any')
  async createRandomForAnyOrganization(): Promise<SalesChannel> {
    console.log(
      'Creating a random sales channel for any organization (testing only)...'
    );

    const newSalesChannel =
      await this.createRandomChannelService.createRandomSalesChannelForAnyOrganization();
    console.log('Random sales channel created:', newSalesChannel);
    return newSalesChannel;
  }
}
