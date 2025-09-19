// apps/api/src/resources/user-invitations/services/find-all-by-org-paginated/service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(UserInvitationEntity)
    private userInvitationsRepository: Repository<UserInvitationEntity>,
    @InjectRepository(OrganizationEntity)
    private organizationsRepository: Repository<OrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Get paginated user invitations for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<UserInvitationEntity>> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    console.log(
      `Getting paginated user invitations for organization: ${organization?.name}`
    );

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds (min: 1, max: 100)
      route: `/user-invitations/paginated`, // Updated route for generating pagination links
    };

    // Build query for current organization
    const queryBuilder = this.userInvitationsRepository
      .createQueryBuilder('userInvitation')
      .leftJoinAndSelect('userInvitation.organization', 'organization')
      .leftJoinAndSelect('userInvitation.invitedBy', 'invitedBy')
      .where('userInvitation.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('userInvitation.id', 'DESC'); // Order by ID descending

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<UserInvitationEntity>(queryBuilder, options);
  }
}
