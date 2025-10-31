// apps/api/src/resources/cms/prices/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PriceEntity } from '@/database/entities/price.entity';
import { IPrice } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetPricesByIdsService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getPricesByIds(ids: number[]): Promise<IPrice[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.priceRepository.find({
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
