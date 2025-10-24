// apps/api/src/common/interceptors/cache-logging.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//------------------------------------------------------------

@Injectable()
export class CacheLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheLoggingInterceptor.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const endpoint = `${request.method} ${request.url}`;

    // Only log for GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Generate cache key (same logic as OrganizationCacheInterceptor)
    const organizationId = request.currentOrganization?.id || 'no-org';
    const cacheKey = `${organizationId}:${request.url}`;

    // Check if in cache
    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      this.logger.log(`💾 [${endpoint}] CACHE HIT`);
    } else {
      this.logger.log(`🔄 [${endpoint}] CACHE MISS`);
    }

    return next.handle().pipe(
      tap(() => {
        if (!cachedResponse) {
          this.logger.log(`✅ [${endpoint}] Response cached`);
        }
      })
    );
  }
}
