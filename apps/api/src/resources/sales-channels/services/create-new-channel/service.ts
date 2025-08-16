// apps/api/src/resources/sales-channels/services/create-new-channel/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//-------------------------------------------

@Injectable()
export class CreateNewChannelService {
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
   * Creates a new sales channel for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createNewSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    console.log('Creating new sales channel with DTO:', createSalesChannelDto);

    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    console.log('Creating sales channel for organization:', organization.name);

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
    // Automatically get the current organization from context
    const organization = await this.getRequiredOrganization();

    return this.salesChannelsRepository.find({
      where: { organizationId: organization.id },
      relations: ['organization'],
      order: { id: 'DESC' },
    });
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

  /**
   * Update a sales channel for the current user's organization
   */
  async updateForCurrentOrganization(
    id: number,
    updateDto: Partial<CreateSalesChannelDto>
  ): Promise<SalesChannel> {
    const salesChannel = await this.findOneForCurrentOrganization(id);

    Object.assign(salesChannel, updateDto);

    return this.salesChannelsRepository.save(salesChannel);
  }

  /**
   * Delete a sales channel for the current user's organization
   */
  async removeForCurrentOrganization(id: number): Promise<void> {
    const salesChannel = await this.findOneForCurrentOrganization(id);
    await this.salesChannelsRepository.remove(salesChannel);
  }

  /**
   * Optional: Get current user info
   */
  async getCurrentUserInfo() {
    const [user, organization] = await Promise.all([
      this.currentDbUserService.getCurrentDbUser(),
      this.currentOrganizationService.getCurrentOrganization(),
    ]);

    return {
      user: user
        ? { id: user.id, email: user.email, fullName: user.fullName }
        : null,
      organization: organization
        ? { id: organization.id, name: organization.name }
        : null,
    };
  }
}
