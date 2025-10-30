// apps/api/src/resources/offer-inclusions/services/create-offer-inclusion/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '../../../../../database/entities/offer-inclusion.entity';
import { CreateOfferInclusionDto } from './create-offer-inclusion.dto';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class CreateOfferInclusionService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createOfferInclusion(
    createOfferInclusionDto: CreateOfferInclusionDto
  ): Promise<IOfferInclusion> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const offerInclusion = this.offerInclusionRepository.create({
      ...createOfferInclusionDto,
      organizationId: organization?.id,
    });

    return this.offerInclusionRepository.save(offerInclusion);
  }
}
