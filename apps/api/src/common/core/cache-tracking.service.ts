// apps/api/src/common/services/cache-tracking.service.ts

import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * CacheTrackingService - Organization-specific Cache Key Management
 *
 * Tracks cache keys by organization to enable targeted cache invalidation.
 * Maintains a separate tracking key for each organization that contains
 * all cache keys belonging to that organization.
 *
 * Key Benefits:
 * - Enables precise cache invalidation per organization
 * - Avoids reliance on cache store's keys() method (which may not be available)
 * - Provides better performance than clearing entire cache
 * - Maintains multi-tenant cache isolation
 *
 * Storage Structure:
 * - Data cache keys: `{organizationId}:{url}` (e.g., "org-123:https://api.com/users")
 * - Tracking keys: `org_keys:{organizationId}` (e.g., "org_keys:org-123")
 */

@Injectable()
export class CacheTrackingService {
  private readonly logger = new Logger(CacheTrackingService.name);
  private readonly orgKeysPrefix = 'org_keys:';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Track a cache key for a specific organization
   * Adds the cache key to the organization's tracking set
   *
   * @param organizationId - The organization identifier
   * @param cacheKey - The actual cache key used for data storage
   */
  async trackOrganizationKey(
    organizationId: string,
    cacheKey: string
  ): Promise<void> {
    const trackingKey = `${this.orgKeysPrefix}${organizationId}`;

    try {
      // Get current tracked keys for this organization from cache
      const currentKeys: string[] =
        (await this.cacheManager.get(trackingKey)) || [];

      // Add new key if not already tracked (avoid duplicates)
      if (!currentKeys.includes(cacheKey)) {
        currentKeys.push(cacheKey);

        // Store updated key list with no TTL since tracking should persist
        // until explicitly cleared during invalidation
        await this.cacheManager.set(trackingKey, currentKeys, 0);

        this.logger.debug(
          `📝 Tracking new cache key for org ${organizationId}: ${cacheKey}`
        );
      }
    } catch (err) {
      this.logger.error(
        `❌ Failed to track cache key for org ${organizationId}: ${err.message}`
      );
    }
  }

  /**
   * Retrieve all cache keys for a specific organization
   *
   * @param organizationId - The organization identifier
   * @returns Array of cache keys belonging to the organization
   */
  async getOrganizationKeys(organizationId: string): Promise<string[]> {
    const trackingKey = `${this.orgKeysPrefix}${organizationId}`;
    return (await this.cacheManager.get(trackingKey)) || [];
  }

  /**
   * Clear all cached data for a specific organization
   * Deletes both the cached data and the tracking information
   *
   * @param organizationId - The organization identifier
   */
  async clearOrganizationCache(organizationId: string): Promise<void> {
    const trackingKey = `${this.orgKeysPrefix}${organizationId}`;

    try {
      // Get all cache keys we've tracked for this organization
      const keysToDelete = await this.getOrganizationKeys(organizationId);

      if (keysToDelete.length === 0) {
        this.logger.debug(
          `No cache keys to clear for organization ${organizationId}`
        );
        return;
      }

      // Delete all cached data entries for the organization
      const deletionPromises = keysToDelete.map((key) =>
        this.cacheManager
          .del(key)
          .catch((err) =>
            this.logger.warn(
              `Failed to delete cache key ${key}: ${err.message}`
            )
          )
      );

      await Promise.all(deletionPromises);

      // Clear the tracking key itself to reset the tracking
      await this.cacheManager.del(trackingKey);

      this.logger.warn(
        `🗑️ Cleared ${keysToDelete.length} cache keys for organization ${organizationId}`
      );
    } catch (err) {
      this.logger.error(
        `❌ Failed to clear cache for org ${organizationId}: ${err.message}`
      );
      throw err; // Re-throw to allow caller to handle the error
    }
  }
}
