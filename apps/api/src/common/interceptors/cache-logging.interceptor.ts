// apps/api/src/common/interceptors/cache-logging.interceptor.ts

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
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';
import { CurrentOrganizationService } from '../services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class CacheLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheLoggingInterceptor.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const endpoint = `${request.method} ${request.url}`;

    if (request.method !== 'GET') {
      return next.handle();
    }

    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noCache) {
      this.logger.warn(`🚫 [${endpoint}] Cache excluded`);
      return next.handle();
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();
    const organizationId = organization?.id || 'no-org';
    const cacheKey = `${organizationId}:${request.url}`;

    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      this.logger.log(
        `💾 [${endpoint}] CACHE HIT (org: ${organizationId}, key: ${cacheKey})`
      );
    } else {
      this.logger.log(
        `🔄 [${endpoint}] CACHE MISS (org: ${organizationId}, key: ${cacheKey})`
      );
    }

    return next.handle().pipe(
      tap(() => {
        if (!cachedResponse) {
          this.logger.log(
            `✅ [${endpoint}] Response cached (org: ${organizationId}, key: ${cacheKey})`
          );
        }
      })
    );
  }
}
