// apps/api/src/resources/offer-exclusions/services/get-offer-exclusion-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetOfferExclusionByIdService {
  constructor(
    @InjectRepository(OfferExclusionEntity)
    private offerExclusionRepository: Repository<OfferExclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getOfferExclusionById(
    offerExclusionId: number
  ): Promise<IOfferExclusion> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const offerExclusion = await this.offerExclusionRepository.findOne({
      where: {
        id: offerExclusionId,
        organizationId: organization.id,
      },
      relations: ['organization'],
    });

    if (!offerExclusion) {
      throw new NotFoundException(
        `Offer exclusion with ID ${offerExclusionId} not found in current organization`
      );
    }

    return offerExclusion;
  }
}
