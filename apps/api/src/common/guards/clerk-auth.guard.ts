// apps/api/src/common/guards/clerk-auth.guard.ts

import {
  type ExecutionContext,
  Injectable,
  Scope,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { Request } from 'express';

//----------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class ClerkAuthGuard extends AuthGuard('clerk') {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (err || !user) {
      this.logger.error('🚫 UNAUTHENTICATED REQUEST:', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        timestamp: new Date().toISOString(),
        error: err?.message || 'No user found',
        info: info?.message || 'No additional info',
      });
    }

    return super.handleRequest(err, user, info, context);
  }
}
