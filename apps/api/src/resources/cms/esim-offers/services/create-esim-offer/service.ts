// apps/api/src/resources/esim-offers/services/create-esim-offer/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { CreateEsimOfferDto } from './create-esim-offer.dto';
import { IEsimOffer } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class CreateEsimOfferService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createEsimOffer(
    createEsimOfferDto: CreateEsimOfferDto
  ): Promise<IEsimOffer> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const esimOffer = this.esimOfferRepository.create({
      title: createEsimOfferDto.title,
      descriptionHtml: createEsimOfferDto.descriptionHtml,
      descriptionText: createEsimOfferDto.descriptionText,
      durationInDays: createEsimOfferDto.durationInDays,
      dataInGb: createEsimOfferDto.isUnlimitedData
        ? null
        : createEsimOfferDto.dataInGb,
      isUnlimitedData: createEsimOfferDto.isUnlimitedData,
      isActive: createEsimOfferDto.isActive ?? true,
      organizationId: organization?.id,
      mainImageId: createEsimOfferDto.mainImageId || null,
      inclusions:
        createEsimOfferDto.inclusionIds?.map((id) => ({ id }) as any) || [],
      exclusions:
        createEsimOfferDto.exclusionIds?.map((id) => ({ id }) as any) || [],
      images: createEsimOfferDto.imageIds?.map((id) => ({ id }) as any) || [],
      countries:
        createEsimOfferDto.countryIds?.map((id) => ({ id }) as any) || [],
      salesChannels:
        createEsimOfferDto.salesChannelIds?.map((id) => ({ id }) as any) || [],
      prices: createEsimOfferDto.priceIds?.map((id) => ({ id }) as any) || [],
    });

    return this.esimOfferRepository.save(esimOffer);
  }
}
