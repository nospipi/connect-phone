// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { CurrentDbUserRoleService } from '../../../../common/core/current-db-user-role.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(SalesChannelEntity)
    private salesChannelsRepository: Repository<SalesChannelEntity>,
    //@InjectRepository(Organization)
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /*
    Get paginated sales channels for the current user's organization
    Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<SalesChannelEntity>> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds (min: 1, max: 100)
      route: `/sales-channels/paginated`, // Updated route for generating pagination links
    };

    // Build query for current organization
    const queryBuilder = this.salesChannelsRepository
      .createQueryBuilder('salesChannel')
      .leftJoinAndSelect('salesChannel.organization', 'organization')
      .leftJoinAndSelect('salesChannel.logo', 'logo')
      .where('salesChannel.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('salesChannel.id', 'DESC'); // Order by ID descending

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<SalesChannelEntity>(queryBuilder, options);
  }
}
