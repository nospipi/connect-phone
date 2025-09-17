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
    //@InjectRepository(Organization)
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Creates a new sales channel for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createNewSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const salesChannel = this.salesChannelsRepository.create({
      ...createSalesChannelDto,
      organizationId: organization?.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }

  /**
   * Get all sales channels for the current user's organization
   */
  async getAllForCurrentOrganization(): Promise<SalesChannel[]> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.salesChannelsRepository.find({
      where: { organizationId: organization?.id },
      relations: ['organization'],
      order: { id: 'DESC' },
    });
  }

  /**
   * Find a specific sales channel for the current user's organization
   */
  async findOneForCurrentOrganization(id: number): Promise<SalesChannel> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const salesChannel = await this.salesChannelsRepository.findOne({
      where: { id, organizationId: organization?.id },
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
}
