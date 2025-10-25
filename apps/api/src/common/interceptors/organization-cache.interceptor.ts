// // // apps/api/src/common/interceptors/organization-cache.interceptor.ts

// // import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
// // import { CacheInterceptor } from '@nestjs/cache-manager';
// // import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
// // //------------------------------------------------------------

// // /**
// //  * OrganizationCacheInterceptor - Organization-scoped HTTP Response Caching
// //  *
// //  * Extends NestJS CacheInterceptor to provide multi-tenant cache isolation by scoping
// //  * cache keys to organization context. Ensures users only receive cached responses
// //  * from their own organization's data.
// //  *
// //  * Key Features:
// //  * - Generates cache keys as: `{organizationId}:{url}`
// //  * - Only caches GET requests
// //  * - Respects @NoCache() decorator to exclude specific endpoints
// //  * - Returns undefined (no caching) for non-GET methods or excluded endpoints
// //  *
// //  * Cache invalidation is handled by CacheInvalidationInterceptor on mutations.
// //  */

// // @Injectable()
// // export class OrganizationCacheInterceptor extends CacheInterceptor {
// //   private readonly logger = new Logger(OrganizationCacheInterceptor.name);

// //   trackBy(context: ExecutionContext): string | undefined {
// //     const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
// //       context.getHandler(),
// //       context.getClass(),
// //     ]);

// //     if (noCache) {
// //       return undefined;
// //     }

// //     const request = context.switchToHttp().getRequest();
// //     const { httpAdapter } = this.httpAdapterHost;

// //     if (request.method !== 'GET') {
// //       return undefined;
// //     }

// //     const organizationId = request.currentOrganization?.id || 'no-org';
// //     const url = httpAdapter.getRequestUrl(request);
// //     const cacheKey = `${organizationId}:${url}`;

// //     this.logger.debug(`Cache key generated: ${cacheKey}`);

// //     return cacheKey;
// //   }
// // }

// // apps/api/src/common/interceptors/organization-cache.interceptor.ts

// import {
//   Injectable,
//   ExecutionContext,
//   CallHandler,
//   Logger,
//   Inject,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { CacheInterceptor } from '@nestjs/cache-manager';
// import { Observable, of } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

// //------------------------------------------------------------

// @Injectable()
// export class OrganizationCacheInterceptor extends CacheInterceptor {
//   private readonly logger = new Logger(OrganizationCacheInterceptor.name);
//   private readonly defaultTtl = 300000;

//   constructor(
//     @Inject(CACHE_MANAGER) cacheManager: Cache,
//     reflector: Reflector
//   ) {
//     super(cacheManager, reflector);
//   }

//   trackBy(context: ExecutionContext): string | undefined {
//     const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (noCache) {
//       return undefined;
//     }

//     const request = context.switchToHttp().getRequest();
//     const { httpAdapter } = this.httpAdapterHost;

//     if (request.method !== 'GET') {
//       return undefined;
//     }

//     const organizationId = request.currentOrganization?.id || 'no-org';
//     const url = httpAdapter.getRequestUrl(request);
//     const cacheKey = `${organizationId}:${url}`;

//     this.logger.debug(`Cache key generated: ${cacheKey}`);
//     return cacheKey;
//   }

//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler
//   ): Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const endpoint = `${request.method} ${request.url}`;

//     const cacheKey = this.trackBy(context);

//     if (!cacheKey) {
//       return next.handle();
//     }

//     try {
//       const cachedValue = await this.cacheManager.get(cacheKey);

//       if (cachedValue) {
//         this.logger.log(`🚀 [${endpoint}] CACHE HIT - Key: ${cacheKey}`);
//         return of(cachedValue);
//       }

//       this.logger.error(`👻 [${endpoint}] CACHE MISS - Key: ${cacheKey}`);

//       return next.handle().pipe(
//         tap((response) => {
//           const ttl = this.reflector.get('cache_ttl', context.getHandler());
//           this.cacheManager.set(cacheKey, response, ttl);
//           this.logger.log(
//             `✅ [${endpoint}] Response cached - Key: ${cacheKey}`
//           );
//         })
//       );
//     } catch (error) {
//       this.logger.error(`❌ [${endpoint}] Cache error: ${error.message}`);
//       return next.handle();
//     }
//   }
// }

// apps/api/src/common/interceptors/organization-cache.interceptor.ts

import {
  Injectable,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

//------------------------------------------------------------

@Injectable()
export class OrganizationCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(OrganizationCacheInterceptor.name);
  //private readonly defaultTtl = 300000; // 5 minutes in milliseconds
  //private readonly defaultTtl = 300000; // 5 minutes in milliseconds

  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector
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
    return cacheKey;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const endpoint = `${request.method} ${request.url}`;

    const cacheKey = this.trackBy(context);

    if (!cacheKey) {
      return next.handle();
    }

    try {
      const cachedValue = await this.cacheManager.get(cacheKey);

      if (cachedValue) {
        this.logger.log(`🚀 [${endpoint}] CACHE HIT - Key: ${cacheKey}`);
        return of(cachedValue);
      }

      this.logger.error(`👻 [${endpoint}] CACHE MISS - Key: ${cacheKey}`);

      return next.handle().pipe(
        switchMap((response) =>
          from(
            (async () => {
              // const ttl =
              //   this.reflector.get('cache_ttl', context.getHandler()) ||
              //   this.defaultTtl;
              await this.cacheManager.set(cacheKey, response);
              this.logger.log(
                `✅ [${endpoint}] Response cached - Key: ${cacheKey}`
              );
              return response;
            })()
          )
        )
      );
    } catch (error) {
      this.logger.error(`❌ [${endpoint}] Cache error: ${error.message}`);
      return next.handle();
    }
  }
}
