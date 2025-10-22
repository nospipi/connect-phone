// apps/api/src/resources/esim-offers/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsimOfferEntity } from '../../../../database/entities/esim-offer.entity';
import { IEsimOffer } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllEsimOffersPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<IEsimOffer>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/esim-offers/paginated`,
    };

    const queryBuilder = this.esimOfferRepository
      .createQueryBuilder('esimOffer')
      .where('esimOffer.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('esimOffer.createdAt', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere(
        '(esimOffer.title ILIKE :search OR esimOffer.descriptionText ILIKE :search)',
        {
          search: `%${search.trim()}%`,
        }
      );
    }

    return paginate<EsimOfferEntity>(queryBuilder, options);
  }
}
