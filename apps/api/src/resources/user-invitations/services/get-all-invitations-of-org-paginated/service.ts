// apps/api/src/resources/users/services/get-all-invitations-of-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class GetAllInvitationsOfOrgPaginatedService {
  constructor(
    @InjectRepository(UserInvitationEntity)
    private userInvitationRepository: Repository<UserInvitationEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Get paginated user invitations for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    role: string = 'all'
  ): Promise<Pagination<UserInvitationEntity>> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds (min: 1, max: 100)
      route: `/invitations/paginated`, // Updated route for generating pagination links
    };

    const queryBuilder = this.userInvitationRepository
      .createQueryBuilder('userInvitation')
      .leftJoinAndSelect('userInvitation.organization', 'organization')
      .leftJoinAndSelect('userInvitation.invitedBy', 'invitedBy')
      .where('userInvitation.organizationId = :organizationId', {
        organizationId: organization?.id,
      });

    // Add search functionality if search term is provided
    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere('userInvitation.email ILIKE :search', {
        search: searchTerm,
      });
    }

    // Add role filtering if role is not 'all'
    if (role && role.toLowerCase() !== 'all') {
      queryBuilder.andWhere('userInvitation.role = :role', {
        role: role.toUpperCase(),
      });
    }

    queryBuilder.orderBy('userInvitation.id', 'DESC');

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<UserInvitationEntity>(queryBuilder, options);
  }
}
