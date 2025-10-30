// apps/api/src/resources/esim-offers/services/get-all-by-org-paginated/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EsimOfferEntity } from '../../../../../database/entities/esim-offer.entity';
import { IEsimOffer } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';
import { SearchEsimOffersDto } from './search-esim-offers.dto';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllEsimOffersPaginated(
    searchDto: SearchEsimOffersDto
  ): Promise<Pagination<IEsimOffer>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page: searchDto.page || 1,
      limit: Math.min(Math.max(searchDto.limit || 10, 1), 100),
      route: `/esim-offers/paginated`,
    };

    const queryBuilder = this.esimOfferRepository
      .createQueryBuilder('esimOffer')
      .where('esimOffer.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('esimOffer.id', 'DESC');

    if (searchDto.search && searchDto.search.trim().length > 0) {
      queryBuilder.andWhere(
        '(esimOffer.title ILIKE :search OR esimOffer.descriptionText ILIKE :search)',
        {
          search: `%${searchDto.search.trim()}%`,
        }
      );
    }

    if (searchDto.isActive !== undefined) {
      queryBuilder.andWhere('esimOffer.isActive = :isActive', {
        isActive: searchDto.isActive,
      });
    }

    if (searchDto.isUnlimitedData !== undefined) {
      queryBuilder.andWhere('esimOffer.isUnlimitedData = :isUnlimitedData', {
        isUnlimitedData: searchDto.isUnlimitedData,
      });
    }

    if (searchDto.minDataInGb !== undefined) {
      queryBuilder.andWhere('esimOffer.dataInGb >= :minDataInGb', {
        minDataInGb: searchDto.minDataInGb,
      });
    }

    if (searchDto.maxDataInGb !== undefined) {
      queryBuilder.andWhere('esimOffer.dataInGb <= :maxDataInGb', {
        maxDataInGb: searchDto.maxDataInGb,
      });
    }

    if (searchDto.minDurationInDays !== undefined) {
      queryBuilder.andWhere('esimOffer.durationInDays >= :minDurationInDays', {
        minDurationInDays: searchDto.minDurationInDays,
      });
    }

    if (searchDto.maxDurationInDays !== undefined) {
      queryBuilder.andWhere('esimOffer.durationInDays <= :maxDurationInDays', {
        maxDurationInDays: searchDto.maxDurationInDays,
      });
    }

    if (searchDto.countryIds && searchDto.countryIds.length > 0) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 
          FROM esim_offer_countries eoc 
          WHERE eoc."offerId" = esimOffer.id 
          AND eoc."countryId" IN (:...countryIds)
        )`,
        { countryIds: searchDto.countryIds }
      );
    }

    if (searchDto.salesChannelIds && searchDto.salesChannelIds.length > 0) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 
          FROM esim_offer_sales_channels eosc 
          WHERE eosc."offerId" = esimOffer.id 
          AND eosc."salesChannelId" IN (:...salesChannelIds)
        )`,
        { salesChannelIds: searchDto.salesChannelIds }
      );
    }

    if (searchDto.priceIds && searchDto.priceIds.length > 0) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 
          FROM esim_offer_prices eop 
          WHERE eop."offerId" = esimOffer.id 
          AND eop."priceId" IN (:...priceIds)
        )`,
        { priceIds: searchDto.priceIds }
      );
    }

    const paginationResult = await paginate<EsimOfferEntity>(
      queryBuilder,
      options
    );

    const offerIds = paginationResult.items.map((offer) => offer.id);

    if (offerIds.length > 0) {
      const offersWithRelations = await this.esimOfferRepository
        .createQueryBuilder('esimOffer')
        .leftJoinAndSelect('esimOffer.mainImage', 'mainImage')
        .leftJoinAndSelect('esimOffer.images', 'images')
        .leftJoinAndSelect('esimOffer.countries', 'countries')
        .leftJoinAndSelect('esimOffer.salesChannels', 'salesChannels')
        .leftJoinAndSelect('esimOffer.prices', 'prices')
        .where('esimOffer.id IN (:...offerIds)', { offerIds })
        .getMany();

      const offerMap = new Map(
        offersWithRelations.map((offer) => [offer.id, offer])
      );

      const itemsWithRelations = paginationResult.items.map(
        (offer) => offerMap.get(offer.id) || offer
      );

      return {
        ...paginationResult,
        items: itemsWithRelations,
      };
    }

    return paginationResult;
  }
}
