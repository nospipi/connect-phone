// apps/api/src/resources/sales-channels/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SalesChannelEntity } from '../../../../../database/entities/sales-channel.entity';
import { ISalesChannel } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetSalesChannelsByIdsService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getSalesChannelsByIds(ids: number[]): Promise<ISalesChannel[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.salesChannelRepository.find({
      where: {
        id: In(ids),
        organizationId: organization?.id,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
