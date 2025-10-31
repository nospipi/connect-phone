// apps/api/src/resources/cms/offer-inclusions/services/get-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { IOfferInclusion } from '@connect-phone/shared-types';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetAllByOrgPaginatedService {
  constructor(
    @InjectRepository(OfferInclusionEntity)
    private offerInclusionRepository: Repository<OfferInclusionEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllOfferInclusionsPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<Pagination<IOfferInclusion>> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/offer-inclusions/paginated`,
    };

    const queryBuilder = this.offerInclusionRepository
      .createQueryBuilder('offerInclusion')
      .where('offerInclusion.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('offerInclusion.createdAt', 'DESC');

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere('offerInclusion.body ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return paginate<OfferInclusionEntity>(queryBuilder, options);
  }
}
