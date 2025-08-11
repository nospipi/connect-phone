import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/guards/decorators/public.decorator';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard extends AuthGuard('clerk') {
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

    // Log unauthenticated hits
    if (err || !user) {
      console.log('🚫 UNAUTHENTICATED REQUEST:', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        timestamp: new Date().toISOString(),
        error: err?.message || 'No user found',
        info: info?.message || 'No additional info',
      });
    }

    // Call the parent handleRequest to maintain original behavior
    return super.handleRequest(err, user, info, context);
  }
}
