// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { OrganizationContextService } from '../../../../common/core/organization-context.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private organizationContextService: OrganizationContextService // 🎯 Inject organization context
  ) {}

  /**
   * Get paginated sales channels for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<SalesChannel>> {
    // Automatically get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    console.log(
      `Getting paginated sales channels for organization: ${organization.name}`
    );

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
      .where('salesChannel.organizationId = :organizationId', {
        organizationId: organization.id,
      })
      .orderBy('salesChannel.id', 'DESC'); // Order by ID descending

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<SalesChannel>(queryBuilder, options);
  }

  /**
   * Get paginated sales channels with custom ordering
   */
  async findAllByOrganizationPaginatedWithCustomOrder(
    page: number = 1,
    limit: number = 10,
    orderBy: 'id' | 'name' | 'createdAt' = 'id',
    orderDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<Pagination<SalesChannel>> {
    // Automatically get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    console.log(
      `Getting paginated sales channels for organization: ${organization.name} with custom order`
    );

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/sales-channels/paginated`,
    };

    // Build query with custom ordering
    const queryBuilder = this.salesChannelsRepository
      .createQueryBuilder('salesChannel')
      .leftJoinAndSelect('salesChannel.organization', 'organization')
      .where('salesChannel.organizationId = :organizationId', {
        organizationId: organization.id,
      })
      .orderBy(`salesChannel.${orderBy}`, orderDirection);

    return paginate<SalesChannel>(queryBuilder, options);
  }

  /**
   * Search paginated sales channels for current organization
   */
  async searchPaginated(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<SalesChannel>> {
    // Automatically get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    console.log(
      `Searching sales channels for organization: ${organization.name} with term: "${searchTerm}"`
    );

    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100),
      route: `/sales-channels/paginated`,
    };

    // Build search query
    const queryBuilder = this.salesChannelsRepository
      .createQueryBuilder('salesChannel')
      .leftJoinAndSelect('salesChannel.organization', 'organization')
      .where('salesChannel.organizationId = :organizationId', {
        organizationId: organization.id,
      })
      .andWhere(
        '(salesChannel.name ILIKE :searchTerm OR salesChannel.description ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      )
      .orderBy('salesChannel.id', 'DESC');

    return paginate<SalesChannel>(queryBuilder, options);
  }

  /**
   * Get pagination stats for current organization
   */
  async getPaginationStats() {
    // Automatically get the current organization from context
    const organization =
      await this.organizationContextService.getRequiredOrganization();

    const totalCount = await this.salesChannelsRepository.count({
      where: { organizationId: organization.id },
    });

    return {
      organizationName: organization.name,
      organizationId: organization.id,
      totalSalesChannels: totalCount,
      recommendedPageSize: totalCount > 50 ? 20 : 10,
      estimatedPages: Math.ceil(totalCount / 10),
    };
  }
}
