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
 * CacheInvalidationInterceptor - Automatic Cache Clearing on Data Mutations
 *
 * Intercepts mutating HTTP methods (POST, PUT, PATCH, DELETE) and clears the entire
 * cache after successful completion to ensure data consistency. This prevents stale
 * cached responses from being served after database changes.
 *
 * Key Features:
 * - Triggers on: POST, PUT, PATCH, DELETE methods only
 * - Clears entire cache store after successful mutations
 * - Respects @NoCacheInvalidation() decorator to skip clearing on specific endpoints
 * - Async cache clearing doesn't block response (fire-and-forget)
 *
 * Works in tandem with OrganizationCacheInterceptor which handles cache storage.
 * Use @NoCacheInvalidation() on endpoints where cache clearing is not needed
 * (e.g., read-only operations disguised as POST, or bulk operations).
 */

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.currentOrganization?.id || 'no-org';

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

    this.logger.debug(`Organization Context: ${organizationId}`);

    return next.handle().pipe(
      tap(() => {
        this.cacheManager
          .clear()
          .then(() => {
            this.logger.warn(`🗑️ [${endpoint}] Cache cleared after mutation`);
          })
          .catch((err) => {
            this.logger.error(
              `❌ Failed to clear cache after ${endpoint}: ${err.message}`
            );
          });
      })
    );
  }
}
