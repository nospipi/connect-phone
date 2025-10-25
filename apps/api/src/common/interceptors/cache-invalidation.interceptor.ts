// // import {
// //   Injectable,
// //   NestInterceptor,
// //   ExecutionContext,
// //   CallHandler,
// //   Logger,
// //   Inject,
// // } from '@nestjs/common';
// // import { Reflector } from '@nestjs/core';
// // import { CACHE_MANAGER } from '@nestjs/cache-manager';
// // import type { Cache } from 'cache-manager';
// // import { Observable } from 'rxjs';
// // import { tap } from 'rxjs/operators';
// // import { NO_CACHE_INVALIDATION_KEY } from '../decorators/no-cache-invalidation.decorator';

// // @Injectable()
// // export class CacheInvalidationInterceptor implements NestInterceptor {
// //   private readonly logger = new Logger(CacheInvalidationInterceptor.name);

// //   constructor(
// //     @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
// //     private reflector: Reflector
// //   ) {}

// //   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
// //     const request = context.switchToHttp().getRequest();
// //     const method = request.method;
// //     const endpoint = `${method} ${request.url}`;

// //     if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
// //       return next.handle();
// //     }

// //     const noInvalidation = this.reflector.getAllAndOverride<boolean>(
// //       NO_CACHE_INVALIDATION_KEY,
// //       [context.getHandler(), context.getClass()]
// //     );

// //     if (noInvalidation) {
// //       this.logger.warn(`🚫 [${endpoint}] Cache invalidation skipped`);
// //       return next.handle();
// //     }

// //     // const organizationId = request.currentOrganization?.id || 'no-org';
// //     // const cacheKey = `${organizationId}:${request.url}`;
// //     // const cachedResponse = await this.cacheManager.get(cacheKey);

// //     return next.handle().pipe(
// //       tap({
// //         next: () => {
// //           this.cacheManager
// //             .clear()
// //             .then(() => {
// //               this.logger.warn(`🗑️ [${endpoint}] Cache cleared after mutation`);
// //             })
// //             .catch((err) => {
// //               this.logger.error(
// //                 `❌ Failed to clear cache after ${endpoint}: ${err.message}`
// //               );
// //             });
// //         },
// //       })
// //     );
// //   }
// // }

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

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

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
          const organizationId = request.currentOrganization?.id || 'no-org';
          const cacheKey = `${organizationId}:${request.url}`;

          this.cacheManager
            .del(cacheKey)
            .then(() => {
              this.logger.warn(
                `🗑️ [${endpoint}] Cache key deleted: ${cacheKey}`
              );
            })
            .catch((err) => {
              this.logger.error(
                `❌ Failed to delete cache key after ${endpoint}: ${err.message}`
              );
            });
        },
      })
    );
  }
}
