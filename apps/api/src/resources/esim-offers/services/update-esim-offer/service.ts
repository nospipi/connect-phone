// apps/api/src/resources/esim-offers/services/update-esim-offer/service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsimOfferEntity } from '../../../../database/entities/esim-offer.entity';
import { UpdateEsimOfferDto } from './update-esim-offer.dto';
import { IEsimOffer } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateEsimOfferService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateEsimOffer(
    updateEsimOfferDto: UpdateEsimOfferDto
  ): Promise<IEsimOffer> {
    if (!updateEsimOfferDto.id) {
      throw new NotFoundException('Esim offer ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const esimOffer = await this.esimOfferRepository.findOne({
      where: {
        id: updateEsimOfferDto.id,
        organizationId: organization.id,
      },
      relations: [
        'inclusions',
        'exclusions',
        'images',
        'countries',
        'salesChannels',
        'prices',
      ],
    });

    if (!esimOffer) {
      throw new NotFoundException(
        `Esim offer with ID ${updateEsimOfferDto.id} not found in current organization`
      );
    }

    if (updateEsimOfferDto.title !== undefined) {
      esimOffer.title = updateEsimOfferDto.title;
    }
    if (updateEsimOfferDto.descriptionHtml !== undefined) {
      esimOffer.descriptionHtml = updateEsimOfferDto.descriptionHtml;
    }
    if (updateEsimOfferDto.descriptionText !== undefined) {
      esimOffer.descriptionText = updateEsimOfferDto.descriptionText;
    }
    if (updateEsimOfferDto.durationInDays !== undefined) {
      esimOffer.durationInDays = updateEsimOfferDto.durationInDays;
    }
    if (updateEsimOfferDto.isUnlimitedData !== undefined) {
      esimOffer.isUnlimitedData = updateEsimOfferDto.isUnlimitedData;
      if (updateEsimOfferDto.isUnlimitedData) {
        esimOffer.dataInGb = null;
      }
    }
    if (
      updateEsimOfferDto.dataInGb !== undefined &&
      !esimOffer.isUnlimitedData
    ) {
      esimOffer.dataInGb = updateEsimOfferDto.dataInGb;
    }
    if (updateEsimOfferDto.isActive !== undefined) {
      esimOffer.isActive = updateEsimOfferDto.isActive;
    }
    if (updateEsimOfferDto.mainImageId !== undefined) {
      esimOffer.mainImageId = updateEsimOfferDto.mainImageId;
    }
    if (updateEsimOfferDto.inclusionIds !== undefined) {
      esimOffer.inclusions = updateEsimOfferDto.inclusionIds.map(
        (id) => ({ id }) as any
      );
    }
    if (updateEsimOfferDto.exclusionIds !== undefined) {
      esimOffer.exclusions = updateEsimOfferDto.exclusionIds.map(
        (id) => ({ id }) as any
      );
    }
    if (updateEsimOfferDto.imageIds !== undefined) {
      esimOffer.images = updateEsimOfferDto.imageIds.map(
        (id) => ({ id }) as any
      );
    }
    if (updateEsimOfferDto.countryIds !== undefined) {
      esimOffer.countries = updateEsimOfferDto.countryIds.map(
        (id) => ({ id }) as any
      );
    }
    if (updateEsimOfferDto.salesChannelIds !== undefined) {
      esimOffer.salesChannels = updateEsimOfferDto.salesChannelIds.map(
        (id) => ({ id }) as any
      );
    }
    if (updateEsimOfferDto.priceIds !== undefined) {
      esimOffer.prices = updateEsimOfferDto.priceIds.map(
        (id) => ({ id }) as any
      );
    }

    const savedOffer = await this.esimOfferRepository.save(esimOffer);

    const reloadedOffer = await this.esimOfferRepository.findOne({
      where: { id: savedOffer.id },
      relations: [
        'organization',
        'inclusions',
        'exclusions',
        'mainImage',
        'images',
        'countries',
        'salesChannels',
        'prices',
      ],
    });

    if (!reloadedOffer) {
      throw new NotFoundException(
        `Esim offer with ID ${savedOffer.id} not found after update`
      );
    }

    return reloadedOffer;
  }
}
