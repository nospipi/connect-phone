// apps/api/src/resources/sales-channels/services/create-new-channel/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { OrganizationContextService } from '../../../../common/core/organization-context.service';

//-------------------------------------------

@Injectable()
export class CreateNewChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private organizationContextService: OrganizationContextService
  ) {}

  /**
   * Creates a new sales channel for the current user's organization
   * No need to pass organizationId - it's automatically retrieved from context
   */
  async createNewSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    console.log('Creating new sales channel with DTO:', createSalesChannelDto);

    // Get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    console.log('Creating sales channel for organization:', organization.name);

    const salesChannel = this.salesChannelsRepository.create({
      ...createSalesChannelDto,
      organizationId: organization.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }

  /**
   * Alternative method: Creates a sales channel for a specific organization ID
   * (keeping the old method for cases where you explicitly want to specify an org)
   */
  async createNewSalesChannelForOrganization(
    createSalesChannelDto: CreateSalesChannelDto,
    organizationId: number
  ): Promise<SalesChannel> {
    console.log('Creating new sales channel with DTO:', createSalesChannelDto);

    // Find organization by ID (as specified in parameter)
    const organization = await this.organizationsRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const salesChannel = this.salesChannelsRepository.create({
      ...createSalesChannelDto,
      organizationId: organization.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }

  /**
   * Get all sales channels for the current user's organization
   */
  async getAllForCurrentOrganization(): Promise<SalesChannel[]> {
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    return this.salesChannelsRepository.find({
      where: { organizationId: organization.id },
      relations: ['organization'],
      order: { id: 'DESC' },
    });
  }
}
