// apps/api/src/resources/offer-exclusions/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferExclusionEntity } from '../../../../database/entities/offer-exclusion.entity';
import { IOfferExclusion } from '@connect-phone/shared-types';
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
    @InjectRepository(OfferExclusionEntity)
    private offerExclusionRepository: Repository<OfferExclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllOfferExclusionsPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<IOfferExclusion>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/offer-exclusions/paginated`,
    };

    const queryBuilder = this.offerExclusionRepository
      .createQueryBuilder('offerExclusion')
      .where('offerExclusion.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('offerExclusion.createdAt', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere('offerExclusion.body ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return paginate<OfferExclusionEntity>(queryBuilder, options);
  }
}
