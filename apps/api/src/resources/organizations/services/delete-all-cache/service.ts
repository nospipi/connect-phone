// apps/api/src/resources/organizations/services/delete-all-cache/service.ts

import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class DeleteAllCacheService {
  private readonly logger = new Logger(DeleteAllCacheService.name);
  private readonly CACHE_REGISTRY_KEY = 'cache:registry';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly currentOrganizationService: CurrentOrganizationService
  ) {}

  async deleteAllCache(): Promise<{ success: boolean; deletedCount: number }> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      this.logger.error('No organization context found');
      return { success: false, deletedCount: 0 };
    }

    const organizationId = organization.id;

    try {
      const registry = await this.cacheManager.get<Record<string, string[]>>(
        this.CACHE_REGISTRY_KEY
      );

      if (!registry || typeof registry !== 'object') {
        this.logger.log(
          `No cache registry found for organization ${organizationId}`
        );
        return { success: true, deletedCount: 0 };
      }

      const allCacheKeys: string[] = [];
      Object.values(registry).forEach((keys) => {
        if (Array.isArray(keys)) {
          allCacheKeys.push(...keys);
        }
      });

      const orgCacheKeys = allCacheKeys.filter((key) =>
        key.startsWith(`${organizationId}:`)
      );

      if (orgCacheKeys.length === 0) {
        this.logger.log(
          `No cache keys found for organization ${organizationId}`
        );
        return { success: true, deletedCount: 0 };
      }

      this.logger.log(
        `Deleting ${orgCacheKeys.length} cache keys for organization ${organizationId}`
      );

      const deletionPromises = orgCacheKeys.map((key) =>
        this.cacheManager.del(key).catch((err) => {
          this.logger.error(
            `Failed to delete cache key ${key}: ${err.message}`
          );
        })
      );

      await Promise.all(deletionPromises);

      const updatedRegistry: Record<string, string[]> = {};
      Object.entries(registry).forEach(([resource, keys]) => {
        const filteredKeys = keys.filter(
          (key) => !key.startsWith(`${organizationId}:`)
        );
        if (filteredKeys.length > 0) {
          updatedRegistry[resource] = filteredKeys;
        }
      });

      await this.cacheManager.set(this.CACHE_REGISTRY_KEY, updatedRegistry);

      this.logger.log(
        `Successfully deleted ${orgCacheKeys.length} cache keys for organization ${organizationId}`
      );

      return { success: true, deletedCount: orgCacheKeys.length };
    } catch (error) {
      this.logger.error(
        `Error deleting cache for organization ${organizationId}: ${error.message}`
      );
      throw error;
    }
  }
}
