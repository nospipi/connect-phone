// apps/api/src/resources/offer-exclusions/services/update-offer-exclusion/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { UpdateOfferExclusionDto } from './update-offer-exclusion.dto';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateOfferExclusionService {
  constructor(
    @InjectRepository(OfferExclusionEntity)
    private offerExclusionRepository: Repository<OfferExclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateOfferExclusion(
    updateOfferExclusionDto: UpdateOfferExclusionDto
  ): Promise<IOfferExclusion> {
    if (!updateOfferExclusionDto.id) {
      throw new NotFoundException('Offer exclusion ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const offerExclusion = await this.offerExclusionRepository.findOne({
      where: {
        id: updateOfferExclusionDto.id,
        organizationId: organization.id,
      },
    });

    if (!offerExclusion) {
      throw new NotFoundException(
        `Offer exclusion with ID ${updateOfferExclusionDto.id} not found in current organization`
      );
    }

    if (updateOfferExclusionDto.body !== undefined) {
      offerExclusion.body = updateOfferExclusionDto.body;
    }

    return this.offerExclusionRepository.save(offerExclusion);
  }
}
