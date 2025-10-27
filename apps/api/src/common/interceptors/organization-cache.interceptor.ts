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

/**
 * OrganizationCacheInterceptor - Organization-Scoped HTTP Response Caching with Resource-Based Invalidation
 *
 * Extends NestJS CacheInterceptor to provide multi-tenant cache isolation and intelligent cache invalidation
 * by organizing cache keys into resource groups. This enables selective cache invalidation without clearing
 * all cached data across the application.
 *
 * Key Features:
 * - Generates organization-scoped cache keys: `{organizationId}:{url}`
 * - Only caches GET requests
 * - Respects @NoCache() decorator to exclude specific endpoints
 * - Maintains a single resource registry object in Redis that groups cache keys by resource name
 * - Registry structure: `cache:registry` → { "date-ranges": [...keys], "prices": [...keys] }
 *
 * How It Works:
 * 1. On cache MISS: Stores response and registers the cache key in its resource group
 * 2. On cache HIT: Returns cached response immediately
 * 3. Resource extraction: Parses URL to identify resource (e.g., /date-ranges/1 → "date-ranges")
 * 4. Registry tracking: Maintains a single object with resource arrays for targeted invalidation
 *
 * Example Registry in Redis:
 * cache:registry → {
 *   "date-ranges": ["1:/date-ranges/paginated?page=1", "1:/date-ranges/4"],
 *   "prices": ["1:/prices/paginated?page=1&limit=10"]
 * }
 *
 * Cache invalidation is handled by CacheInvalidationInterceptor, which uses the registry
 * to invalidate only affected resources on mutations (POST/PUT/PATCH/DELETE).
 */

@Injectable()
export class OrganizationCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(OrganizationCacheInterceptor.name);
  private readonly CACHE_REGISTRY_KEY = 'cache:registry';
  private readonly cache: Cache;

  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector
  ) {
    super(cacheManager, reflector);
    this.cache = cacheManager;
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
      const cachedValue = await this.cache.get(cacheKey);

      if (cachedValue) {
        this.logger.log(`🚀 [${endpoint}] CACHE HIT - Key: ${cacheKey}`);
        return of(cachedValue);
      }

      console.log(`👻 [${endpoint}] CACHE MISS - Key: ${cacheKey}`);

      return next.handle().pipe(
        switchMap((response) =>
          from(
            (async () => {
              await this.cache.set(cacheKey, response);

              const resourceName = this.extractResourceName(request.url);
              await this.registerCacheKey(cacheKey, resourceName);

              this.logger.log(
                `✅ [${endpoint}] Response cached - Key: ${cacheKey}, Resource: ${resourceName}`
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

  private async registerCacheKey(
    cacheKey: string,
    resourceName: string
  ): Promise<void> {
    try {
      let registry: Record<string, string[]> = {};
      const cachedRegistry = await this.cache.get(this.CACHE_REGISTRY_KEY);

      if (cachedRegistry && typeof cachedRegistry === 'object') {
        registry = cachedRegistry as Record<string, string[]>;
      }

      if (!registry[resourceName]) {
        registry[resourceName] = [];
      }

      if (!registry[resourceName].includes(cacheKey)) {
        registry[resourceName].push(cacheKey);
        await this.cache.set(this.CACHE_REGISTRY_KEY, registry);

        this.logger.debug(
          `📋 Registered cache key in resource registry: ${resourceName} -> ${cacheKey}`
        );
        this.logger.debug(
          `📋 Complete cache registry:\n${JSON.stringify(registry, null, 2)}`
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to register cache key in registry: ${error.message}`
      );
    }
  }
}
