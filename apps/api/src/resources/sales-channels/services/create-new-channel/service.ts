// apps/api/src/resources/sales-channels/services/create-new-channel/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import { ISalesChannel } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class CreateNewChannelService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelsRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Creates a new sales channel for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createNewSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<ISalesChannel> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const salesChannel = this.salesChannelsRepository.create({
      ...createSalesChannelDto,
      organizationId: organization?.id,
    });

    const result = await this.salesChannelsRepository
      .createQueryBuilder()
      .insert()
      .into(SalesChannelEntity)
      .values(salesChannel)
      .execute();

    return result.raw[0];
  }
}
