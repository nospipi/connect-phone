// src/common/guards/db-user.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentDbUserService } from '../core/current-db-user.service';
import { CurrentClerkUserService } from '../core/current-clerk-user.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

//----------------------------------------------------------------------

/**
 * Database User Guard
 *
 * This guard enforces that the authenticated Clerk user exists in the database
 * unless the route is marked as @Public()
 *
 * Usage:
 * - Apply to controllers or specific routes that require DB user validation
 * - Works in combination with ClerkAuthGuard (authentication must happen first)
 * - Automatically skipped for @Public() routes
 */

@Injectable()
export class DbUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly currentDbUserService: CurrentDbUserService,
    private readonly currentClerkUserService: CurrentClerkUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public (skips DB user requirement)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('🌍 Public route - skipping database user requirement');
      return true;
    }

    const request = context.switchToHttp().getRequest();

    console.log('🔒👤 DB User guard: Enforcing database user requirement...');

    // Get Clerk user email (this should be available since ClerkAuthGuard runs first)
    const clerkUserEmail = this.currentClerkUserService.getClerkUserEmail();

    if (!clerkUserEmail) {
      console.log('❌ DB User guard: No Clerk user email found');
      throw new UnauthorizedException(
        'Database user access required: Authentication information is missing'
      );
    }

    // Check if user exists in database
    const dbUser = await this.currentDbUserService.getCurrentDbUser();

    if (!dbUser) {
      console.log(
        `❌ DB User guard: User ${clerkUserEmail} not found in database`
      );
      throw new UnauthorizedException(
        'Database user access required: Your account must be set up in our system before you can access this resource'
      );
    }

    console.log(
      `🔒👤 DB User guard: Access granted for user ${dbUser.email} (ID: ${dbUser.id})`
    );

    // Attach to request for controllers and services to use
    request.currentDbUser = dbUser;

    return true;
  }
}
