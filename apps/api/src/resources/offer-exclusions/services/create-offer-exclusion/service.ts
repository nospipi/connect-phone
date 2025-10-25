// apps/api/src/resources/offer-exclusions/services/create-offer-exclusion/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { CreateOfferExclusionDto } from './create-offer-exclusion.dto';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class CreateOfferExclusionService {
  constructor(
    @InjectRepository(OfferExclusionEntity)
    private offerExclusionRepository: Repository<OfferExclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createOfferExclusion(
    createOfferExclusionDto: CreateOfferExclusionDto
  ): Promise<IOfferExclusion> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const offerExclusion = this.offerExclusionRepository.create({
      ...createOfferExclusionDto,
      organizationId: organization?.id,
    });

    return this.offerExclusionRepository.save(offerExclusion);
  }
}
