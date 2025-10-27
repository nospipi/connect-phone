// apps/api/src/common/interceptors/cache-invalidation.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NO_CACHE_INVALIDATION_KEY } from '../decorators/no-cache-invalidation.decorator';

//------------------------------------------------------------

/**
 * CacheInvalidationInterceptor - Resource-Based Cache Invalidation on Mutations
 *
 * Intercepts mutation requests (POST/PUT/PATCH/DELETE) and selectively invalidates only the
 * cached data for the affected resource, rather than clearing the entire cache. Works in
 * conjunction with OrganizationCacheInterceptor's resource registry system.
 *
 * Key Features:
 * - Triggers only on mutation methods: POST, PUT, PATCH, DELETE
 * - Extracts resource name from URL (e.g., /date-ranges/4 → "date-ranges")
 * - Looks up all cached keys for that resource in the registry object
 * - Deletes only those specific cache keys, preserving unrelated cached data
 * - Respects @NoCacheInvalidation() decorator to skip invalidation when needed
 *
 * How It Works:
 * 1. Mutation request completes successfully
 * 2. Extracts resource name from the URL
 * 3. Retrieves registry object: `cache:registry`
 * 4. Deletes each cache key in the resource's array
 * 5. Removes the resource property from the registry object
 * 6. Updates the registry object in Redis
 *
 * Example Flow:
 * - PUT /date-ranges/4 completes
 * - Extracts resource: "date-ranges"
 * - Registry: { "date-ranges": ["1:/date-ranges/paginated?page=1", "1:/date-ranges/4"], "prices": [...] }
 * - Deletes both date-ranges cache keys
 * - Removes "date-ranges" from registry
 * - Updates registry: { "prices": [...] }
 * - Other resources (prices, countries, etc.) remain cached
 *
 * This approach ensures cache coherency while maximizing cache hit rates by only
 * invalidating data that could be affected by the mutation.
 */

//------------------------------------------------------------

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);
  private readonly CACHE_REGISTRY_KEY = 'cache:registry';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const endpoint = `${method} ${request.url}`;

    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const noInvalidation = this.reflector.getAllAndOverride<boolean>(
      NO_CACHE_INVALIDATION_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (noInvalidation) {
      this.logger.warn(`🚫 [${endpoint}] Cache invalidation skipped`);
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const resourceName = this.extractResourceName(request.url);

          this.invalidateResourceCache(resourceName, endpoint).catch((err) => {
            this.logger.error(
              `❌ Failed to invalidate cache for resource ${resourceName} after ${endpoint}: ${err.message}`
            );
          });
        },
      })
    );
  }

  private extractResourceName(url: string): string {
    const urlWithoutQuery = url.split('?')[0];
    const pathSegments = urlWithoutQuery.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return 'unknown';
    }

    const firstSegment = pathSegments[0];

    const validResourcePattern = /^[a-z][a-z0-9-]*$/;
    if (validResourcePattern.test(firstSegment)) {
      return firstSegment;
    }

    return 'unknown';
  }

  private async invalidateResourceCache(
    resourceName: string,
    endpoint: string
  ): Promise<void> {
    try {
      const registry = await this.cacheManager.get<Record<string, string[]>>(
        this.CACHE_REGISTRY_KEY
      );

      if (!registry || typeof registry !== 'object') {
        console.log(
          `🔍 [${endpoint}] No cache registry found or registry is empty`
        );
        return;
      }

      const cachedKeys = registry[resourceName];

      if (
        !cachedKeys ||
        !Array.isArray(cachedKeys) ||
        cachedKeys.length === 0
      ) {
        console.log(
          `🔍 [${endpoint}] No cached keys found for resource: ${resourceName}`
        );
        return;
      }

      console.log(
        `🗑️ [${endpoint}] Invalidating ${cachedKeys.length} cache key(s) for resource: ${resourceName}`
      );
      this.logger.debug(
        `📋 [${endpoint}] Keys to invalidate:\n${JSON.stringify(cachedKeys, null, 2)}`
      );

      const deletionPromises = cachedKeys.map((key) =>
        this.cacheManager.del(key).catch((err) => {
          this.logger.error(
            `❌ Failed to delete cache key ${key}: ${err.message}`
          );
        })
      );

      await Promise.all(deletionPromises);

      delete registry[resourceName];
      await this.cacheManager.set(this.CACHE_REGISTRY_KEY, registry);

      this.logger.log(
        `✅ [${endpoint}] Successfully invalidated cache for resource: ${resourceName}`
      );
      this.logger.debug(
        `📋 [${endpoint}] Updated registry:\n${JSON.stringify(registry, null, 2)}`
      );
    } catch (error) {
      this.logger.error(
        `❌ [${endpoint}] Error during cache invalidation for resource ${resourceName}: ${error.message}`
      );
      throw error;
    }
  }
}
