// // apps/api/src/common/interceptors/cache-invalidation.interceptor.ts

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Logger,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { NO_CACHE_INVALIDATION_KEY } from '../decorators/no-cache-invalidation.decorator';
// import { CacheTrackingService } from '../services/cache-tracking.service';

// //------------------------------------------------------------

// @Injectable()
// export class CacheInvalidationInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(CacheInvalidationInterceptor.name);

//   constructor(
//     private readonly cacheTrackingService: CacheTrackingService,
//     private reflector: Reflector
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const organizationId = request.currentOrganization?.id || 'no-org';

//     const method = request.method;
//     const endpoint = `${method} ${request.url}`;

//     if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
//       return next.handle();
//     }

//     const noInvalidation = this.reflector.getAllAndOverride<boolean>(
//       NO_CACHE_INVALIDATION_KEY,
//       [context.getHandler(), context.getClass()]
//     );

//     if (noInvalidation) {
//       this.logger.warn(`🚫 [${endpoint}] Cache invalidation skipped`);
//       return next.handle();
//     }

//     return next.handle().pipe(
//       tap(() => {
//         this.cacheTrackingService
//           .clearOrganizationCache(String(organizationId))
//           .then(() => {
//             this.logger.warn(
//               `🗑️ [${endpoint}] Organization ${organizationId} cache cleared after mutation`
//             );
//           })
//           .catch((err) => {
//             this.logger.error(
//               `❌ Failed to clear organization ${organizationId} cache after ${endpoint}: ${err.message}`
//             );
//           });
//       })
//     );
//   }
// }

// apps/api/src/common/interceptors/cache-invalidation.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NO_CACHE_INVALIDATION_KEY } from '../decorators/no-cache-invalidation.decorator';
import { CacheTrackingService } from '../services/cache-tracking.service';
import { CurrentOrganizationService } from '../services/current-organization.service';

//------------------------------------------------------------

/**
 * CacheInvalidationInterceptor - Organization-scoped Cache Invalidation
 *
 * Intercepts mutating HTTP methods (POST, PUT, PATCH, DELETE) and clears only
 * the cache entries for the affected organization after successful completion.
 * Uses CacheTrackingService for precision invalidation.
 *
 * Key Features:
 * - Triggers on: POST, PUT, PATCH, DELETE methods only
 * - Clears only organization-specific cache entries
 * - Respects @NoCacheInvalidation() decorator to skip clearing on specific endpoints
 * - Async cache clearing doesn't block response (fire-and-forget)
 * - Multi-tenant safe: maintains cache isolation between organizations
 *
 * Works in tandem with OrganizationCacheInterceptor which handles cache storage.
 */

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

  constructor(
    private readonly cacheTrackingService: CacheTrackingService,
    private readonly currentOrganizationService: CurrentOrganizationService,
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
      tap(() => {
        void (async () => {
          const organization =
            await this.currentOrganizationService.getCurrentOrganization();
          const organizationId = organization?.id || 'no-org';

          this.cacheTrackingService
            .clearOrganizationCache(String(organizationId))
            .then(() => {
              this.logger.warn(
                `🗑️ [${endpoint}] Organization ${organizationId} cache cleared after mutation`
              );
            })
            .catch((err) => {
              this.logger.error(
                `❌ Failed to clear organization ${organizationId} cache after ${endpoint}: ${err.message}`
              );
            });
        })();
      })
    );
  }
}
