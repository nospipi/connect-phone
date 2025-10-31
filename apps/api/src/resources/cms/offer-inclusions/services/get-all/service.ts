// apps/api/src/resources/cms/offer-inclusions/services/get-all/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllOfferInclusionsService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllOfferInclusions(): Promise<IOfferInclusion[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.offerInclusionRepository.find({
      where: {
        organizationId: organization?.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
