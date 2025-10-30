// apps/api/src/resources/organizations/services/delete-all-cache/controller.ts

import { Controller, Delete, UseGuards } from '@nestjs/common';
import { DeleteAllCacheService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { NoCacheInvalidation } from '@/common/decorators/no-cache-invalidation.decorator';

//------------------------------------------------------------

@Controller('organizations')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteAllCacheController {
  constructor(private readonly deleteAllCacheService: DeleteAllCacheService) {}

  @Delete('cache')
  @NoCacheInvalidation()
  async deleteAllCache(): Promise<{ success: boolean; deletedCount: number }> {
    return this.deleteAllCacheService.deleteAllCache();
  }
}
