// apps/api/src/resources/offer-inclusions/services/delete-offer-inclusion/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class DeleteOfferInclusionService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async deleteOfferInclusion(
    offerInclusionId: number
  ): Promise<IOfferInclusion> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const offerInclusion = await this.offerInclusionRepository.findOne({
      where: {
        id: offerInclusionId,
        organizationId: organization.id,
      },
    });

    if (!offerInclusion) {
      throw new NotFoundException(
        `Offer inclusion with ID ${offerInclusionId} not found in current organization`
      );
    }

    await this.offerInclusionRepository.remove(offerInclusion);
    return offerInclusion;
  }
}
