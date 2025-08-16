// apps/api/src/resources/sales-channels/services/create-random-channel/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { faker } from '@faker-js/faker';

//-------------------------------------------

@Injectable()
export class CreateRandomChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private currentOrganizationService: CurrentOrganizationService,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Gets the current organization and throws an error if not found
   */
  private async getRequiredOrganization(): Promise<Organization> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      const user = await this.currentDbUserService.getCurrentDbUser();
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      if (!user.loggedOrganizationId) {
        throw new UnauthorizedException(
          'User is not logged into any organization'
        );
      }
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  /**
   * Creates a random sales channel for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createRandomSalesChannel(): Promise<SalesChannel> {
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    // Create random DTO data
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

  /**
   * Creates a sales channel for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    console.log(
      `Creating sales channel for organization: ${organization.name}`
    );

    return this.createSalesChannelForOrganization(
      createSalesChannelDto,
      organization
    );
  }

  /**
   * Get all sales channels for the current user's organization
   */
  async getAllForCurrentOrganization(): Promise<SalesChannel[]> {
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    return this.salesChannelsRepository.find({
      where: { organizationId: organization.id },
      relations: ['organization'],
      order: { id: 'DESC' },
    });
  }

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

  /**
   * Legacy method: Creates a random sales channel for any random organization
   * This method is for testing/seeding purposes only (doesn't use organization context)
   */
  async createRandomSalesChannelForAnyOrganization(): Promise<SalesChannel> {
    // Get all organizations
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

    console.log(
      `Creating random sales channel for random organization: ${randomOrg.name}`
    );

    return this.createSalesChannelForOrganization(
      createSalesChannelDto,
      randomOrg
    );
  }

  /**
   * Get sales channel stats for the current user's organization
   */
  async getStatsForCurrentOrganization() {
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    const count = await this.salesChannelsRepository.count({
      where: { organizationId: organization.id },
    });

    return {
      organizationName: organization.name,
      totalChannels: count,
      organizationId: organization.id,
    };
  }

  /**
   * Find a specific sales channel for the current user's organization
   */
  async findOneForCurrentOrganization(id: number): Promise<SalesChannel> {
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    const salesChannel = await this.salesChannelsRepository.findOne({
      where: { id, organizationId: organization.id },
      relations: ['organization'],
    });

    if (!salesChannel) {
      throw new NotFoundException('Sales channel not found');
    }

    return salesChannel;
  }
}
