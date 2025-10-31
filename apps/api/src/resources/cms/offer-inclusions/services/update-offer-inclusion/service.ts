// apps/api/src/resources/cms/offer-inclusions/services/update-offer-inclusion/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { UpdateOfferInclusionDto } from './update-offer-inclusion.dto';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateOfferInclusionService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateOfferInclusion(
    updateOfferInclusionDto: UpdateOfferInclusionDto
  ): Promise<IOfferInclusion> {
    if (!updateOfferInclusionDto.id) {
      throw new NotFoundException('Offer inclusion ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const offerInclusion = await this.offerInclusionRepository.findOne({
      where: {
        id: updateOfferInclusionDto.id,
        organizationId: organization.id,
      },
    });

    if (!offerInclusion) {
      throw new NotFoundException(
        `Offer inclusion with ID ${updateOfferInclusionDto.id} not found in current organization`
      );
    }

    if (updateOfferInclusionDto.body !== undefined) {
      offerInclusion.body = updateOfferInclusionDto.body;
    }

    return this.offerInclusionRepository.save(offerInclusion);
  }
}
