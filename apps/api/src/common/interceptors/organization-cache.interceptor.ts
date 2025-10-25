// apps/api/src/common/interceptors/organization-cache.interceptor.ts

import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
import { CacheTrackingService } from '../services/cache-tracking.service';

//------------------------------------------------------------

/**
 * OrganizationCacheInterceptor - Organization-scoped HTTP Response Caching
 *
 * Extends NestJS CacheInterceptor to provide multi-tenant cache isolation by scoping
 * cache keys to organization context. Ensures users only receive cached responses
 * from their own organization's data. Tracks all cache keys for precision invalidation.
 *
 * Key Features:
 * - Generates cache keys as: `{organizationId}:{url}`
 * - Only caches GET requests
 * - Respects @NoCache() decorator to exclude specific endpoints
 * - Tracks cache keys per organization for precision invalidation
 * - Returns undefined (no caching) for non-GET methods or excluded endpoints
 *
 * Cache invalidation is handled by CacheInvalidationInterceptor on mutations.
 */

@Injectable()
export class OrganizationCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(OrganizationCacheInterceptor.name);

  constructor(
    cacheManager: any,
    reflector: any,
    private readonly cacheTrackingService: CacheTrackingService
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noCache) {
      return undefined;
    }

    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    if (request.method !== 'GET') {
      return undefined;
    }

    const organizationId = request.currentOrganization?.id || 'no-org';
    const url = httpAdapter.getRequestUrl(request);
    const cacheKey = `${organizationId}:${url}`;

    this.logger.debug(`Cache key generated: ${cacheKey}`);

    // Track this cache key for the organization
    this.cacheTrackingService
      .trackOrganizationKey(String(organizationId), cacheKey)
      .catch((err) => {
        this.logger.warn(
          `Failed to track cache key ${cacheKey}: ${err.message}`
        );
      });

    return cacheKey;
  }
}
