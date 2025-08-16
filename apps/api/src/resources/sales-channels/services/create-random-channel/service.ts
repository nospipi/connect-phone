// apps/api/src/resources/sales-channels/services/create-random-channel/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { OrganizationContextService } from '../../../../common/core/organization-context.service';
import { faker } from '@faker-js/faker';

//-------------------------------------------

@Injectable()
export class CreateRandomChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private organizationContextService: OrganizationContextService
  ) {}

  //----------------------------------------
  /**
   * Creates a random sales channel for the current user's organization
   */
  async createRandomSalesChannel(): Promise<SalesChannel> {
    // Get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    // Create random DTO data (no organizationId needed)
    const createSalesChannelDto: CreateSalesChannelDto = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
    };

    console.log(
      `Creating random sales channel for organization: ${organization.name}`
    );

    return this.createSalesChannelForOrganization(
      createSalesChannelDto,
      organization
    );
  }

  //----------------------------------------
  /**
   * Creates a sales channel using the current user's organization context
   */
  async createSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    console.log(
      `Creating sales channel for organization: ${organization.name}`
    );

    return this.createSalesChannelForOrganization(
      createSalesChannelDto,
      organization
    );
  }

  //----------------------------------------
  /**
   * Helper method to create a sales channel for a specific organization
   */
  private async createSalesChannelForOrganization(
    createSalesChannelDto: CreateSalesChannelDto,
    organization: Organization
  ): Promise<SalesChannel> {
    const salesChannel = this.salesChannelsRepository.create({
      name: createSalesChannelDto.name,
      description: createSalesChannelDto.description,
      logoUrl: createSalesChannelDto.logoUrl,
      organizationId: organization.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }

  //----------------------------------------
  /**
   * Legacy method: Creates a random sales channel for any random organization
   * This method is for testing/seeding purposes only
   */
  async createRandomSalesChannelForAnyOrganization(): Promise<SalesChannel> {
    // First, get a random organization to use
    const organizations = await this.organizationsRepository.find();
    if (organizations.length === 0) {
      throw new NotFoundException('No organizations found');
    }

    // Pick a random organization
    const randomOrg =
      organizations[Math.floor(Math.random() * organizations.length)];

    // Create random DTO data
    const createSalesChannelDto: CreateSalesChannelDto = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
    };

    return this.createSalesChannelForOrganization(
      createSalesChannelDto,
      randomOrg
    );
  }
}
