// apps/api/src/resources/offer-exclusions/services/get-all/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllOfferExclusionsService {
  constructor(
    @InjectRepository(OfferExclusionEntity)
    private offerExclusionRepository: Repository<OfferExclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllOfferExclusions(): Promise<IOfferExclusion[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.offerExclusionRepository.find({
      where: {
        organizationId: organization?.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
