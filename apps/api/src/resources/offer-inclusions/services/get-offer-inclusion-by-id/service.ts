// apps/api/src/resources/offer-inclusions/services/get-offer-inclusion-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '../../../../database/entities/offer-inclusion.entity';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetOfferInclusionByIdService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getOfferInclusionById(
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
      relations: ['organization'],
    });

    if (!offerInclusion) {
      throw new NotFoundException(
        `Offer inclusion with ID ${offerInclusionId} not found in current organization`
      );
    }

    return offerInclusion;
  }
}
