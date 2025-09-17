// apps/api/src/resources/users/services/get-all-users-of-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrganization } from '../../../../database/entities/user-organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class GetAllUsersOfOrgPaginatedService {
  constructor(
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Get paginated users for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    role: string = 'all'
  ): Promise<Pagination<UserOrganization>> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds (min: 1, max: 100)
      route: `/users/paginated`, // Updated route for generating pagination links
    };

    const queryBuilder = this.userOrganizationRepository
      .createQueryBuilder('userOrganization')
      .leftJoinAndSelect('userOrganization.user', 'user')
      .where('userOrganization.organizationId = :organizationId', {
        organizationId: organization?.id,
      });

    // Add search functionality if search term is provided
    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: searchTerm }
      );
    }

    // Add role filtering if role is not 'all'
    if (role && role.toLowerCase() !== 'all') {
      queryBuilder.andWhere('userOrganization.role = :role', {
        role: role.toUpperCase(),
      });
    }

    queryBuilder.orderBy('userOrganization.id', 'DESC');

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<UserOrganization>(queryBuilder, options);
  }
}
