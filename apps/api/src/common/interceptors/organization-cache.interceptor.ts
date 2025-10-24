// apps/api/src/common/interceptors/organization-cache.interceptor.ts

import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
//------------------------------------------------------------

/**
 * OrganizationCacheInterceptor - Organization-scoped HTTP Response Caching
 *
 * Extends NestJS CacheInterceptor to provide multi-tenant cache isolation by scoping
 * cache keys to organization context. Ensures users only receive cached responses
 * from their own organization's data.
 *
 * Key Features:
 * - Generates cache keys as: `{organizationId}:{url}`
 * - Only caches GET requests
 * - Respects @NoCache() decorator to exclude specific endpoints
 * - Returns undefined (no caching) for non-GET methods or excluded endpoints
 *
 * Cache invalidation is handled by CacheInvalidationInterceptor on mutations.
 */

@Injectable()
export class OrganizationCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(OrganizationCacheInterceptor.name);

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

    return cacheKey;
  }
}
