// apps/api/src/common/interceptors/cache-invalidation.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//------------------------------------------------------------

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInvalidationInterceptor.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const endpoint = `${method} ${request.url}`;

    // Apply invalidation only on mutating methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          // eslint expects sync callback — we trigger async work separately
          this.cacheManager
            .clear()
            .then(() => {
              this.logger.log(`🗑️ [${endpoint}] Cache cleared after mutation`);
            })
            .catch((err) => {
              this.logger.error(
                `❌ Failed to clear cache after ${endpoint}: ${err.message}`
              );
            });
        })
      );
    }

    // For GET and other methods, just continue
    return next.handle();
  }
}
