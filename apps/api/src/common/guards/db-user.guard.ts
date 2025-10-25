// src/common/guards/db-user.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Scope,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentDbUserService } from '../core/current-db-user.service';
import { CurrentClerkUserService } from '../core/current-clerk-user.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

//----------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class DbUserGuard implements CanActivate {
  private readonly logger = new Logger(DbUserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly currentDbUserService: CurrentDbUserService,
    private readonly currentClerkUserService: CurrentClerkUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const endpoint = `${request.method} ${request.url}`;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log(
        `🌍 [${endpoint}] Public route - skipping database user requirement`
      );
      return true;
    }

    this.logger.log(
      `🔒👤 [${endpoint}] DB User guard: Enforcing database user requirement...`
    );

    const clerkUserEmail = this.currentClerkUserService.getClerkUserEmail();

    if (!clerkUserEmail) {
      this.logger.log(
        `❌ [${endpoint}] DB User guard: No Clerk user email found`
      );
      throw new UnauthorizedException(
        'Database user access required: Authentication information is missing'
      );
    }

    const dbUser = await this.currentDbUserService.getCurrentDbUser();

    if (!dbUser) {
      this.logger.log(
        `❌ [${endpoint}] DB User guard: User ${clerkUserEmail} not found in database`
      );
      throw new UnauthorizedException(
        'Database user access required: Your account must be set up in our system before you can access this resource'
      );
    }

    this.logger.log(
      `🔒👤 [${endpoint}] DB User guard: Access granted for user ${dbUser.email} (ID: ${dbUser.id})`
    );

    request.currentDbUser = dbUser;

    return true;
  }
}
