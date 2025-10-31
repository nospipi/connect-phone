// apps/api/src/resources/sales-channels/services/update-sales-channel/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { UpdateSalesChannelDto } from './update-sales-channel.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class UpdateSalesChannelService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelsRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Updates a sales channel by ID for the current user's organization
   * Organization context is automatically retrieved and validated
   */
  async updateSalesChannel(
    updateSalesChannelDto: UpdateSalesChannelDto
  ): Promise<ISalesChannel> {
    if (!updateSalesChannelDto.id) {
      throw new NotFoundException('Sales channel ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    // Find the sales channel with organization validation
    const salesChannel = await this.salesChannelsRepository.findOne({
      where: {
        id: updateSalesChannelDto.id,
        organizationId: organization.id,
      },
      relations: ['organization'],
    });

    if (!salesChannel) {
      throw new NotFoundException(
        `Sales channel with ID ${updateSalesChannelDto.id} not found in current organization`
      );
    }

    // Update only provided fields
    if (updateSalesChannelDto.name !== undefined) {
      salesChannel.name = updateSalesChannelDto.name;
    }
    if (updateSalesChannelDto.description !== undefined) {
      salesChannel.description = updateSalesChannelDto.description || null;
    }
    if (updateSalesChannelDto.logoId !== undefined) {
      salesChannel.logoId = updateSalesChannelDto.logoId;
    }
    if (updateSalesChannelDto.isActive !== undefined) {
      salesChannel.isActive = updateSalesChannelDto.isActive;
    }

    const updatedSalesChannel =
      await this.salesChannelsRepository.save(salesChannel);

    return updatedSalesChannel;
  }
}
