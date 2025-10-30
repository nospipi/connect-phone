// apps/api/src/resources/sales-channels/services/delete-sales-channel/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannelEntity } from '../../../../../database/entities/sales-channel.entity';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class DeleteSalesChannelService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Deletes a sales channel by ID from the current user's organization
   * Organization context is automatically retrieved and validated
   */
  async deleteSalesChannel(salesChannelId: number): Promise<ISalesChannel> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    // Find the sales channel with relations to verify ownership
    const salesChannel = await this.salesChannelRepository.findOne({
      where: {
        id: salesChannelId,
        organizationId: organization.id,
      },
      relations: ['organization'],
    });

    if (!salesChannel) {
      throw new NotFoundException(
        `Sales channel with ID ${salesChannelId} not found in current organization`
      );
    }

    // Delete the sales channel
    await this.salesChannelRepository.remove(salesChannel);

    return salesChannel;
  }
}
