// apps/api/src/resources/audit-logs/services/find-all-by-org-paginated/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntryEntity } from '../../../../database/entities/audit-log.entity';
import { IAuditLog } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(AuditLogEntryEntity)
    private auditLogsRepository: Repository<AuditLogEntryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Get paginated sales channels for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async findAllByOrganizationPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<IAuditLog>> {
    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds (min: 1, max: 100)
      route: `/audit-logs/paginated`, // Updated route for generating pagination links
    };

    // Build query for current organization
    const queryBuilder = this.auditLogsRepository
      .createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.organization', 'organization')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.organizationId = :organizationId', {
        organizationId: organization?.id,
      })
      .orderBy('auditLog.id', 'DESC'); // Order by ID descending

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<AuditLogEntryEntity>(queryBuilder, options);
  }
}
