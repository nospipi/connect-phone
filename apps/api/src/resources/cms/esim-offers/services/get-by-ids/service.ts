// apps/api/src/resources/cms/esim-offers/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { IEsimOffer } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetEsimOffersByIdsService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getEsimOffersByIds(ids: number[]): Promise<IEsimOffer[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.esimOfferRepository.find({
      where: {
        id: In(ids),
        organizationId: organization?.id,
      },
      order: {
        title: 'ASC',
      },
    });
  }
}
