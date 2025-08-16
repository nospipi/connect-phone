// src/common/guards/organization.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentOrganizationService } from '../core/current-organization.service';
import { CurrentDbUserService } from '../core/current-db-user.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

//----------------------------------------------------------------------

/**
 * Organization Guard
 *
 * This guard enforces organization access requirement unless route is @Public()
 *
 * The guard handles all validation and error throwing
 * The service just provides current data (no errors)
 */

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly currentOrganizationService: CurrentOrganizationService,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public (overrides organization requirement)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('🌍 Public route - skipping organization requirement');
      return true;
    }

    const request = context.switchToHttp().getRequest();

    console.log('🔒 Organization guard: Enforcing organization requirement...');

    // Get current user and organization (no errors thrown by service)
    const [user, organization] = await Promise.all([
      this.currentDbUserService.getCurrentDbUser(),
      this.currentOrganizationService.getCurrentOrganization(),
    ]);

    // Guard handles all validation and error throwing
    if (!user) {
      console.log('❌ Organization guard: User not found in database');
      throw new UnauthorizedException(
        'Organization access required: Your account must be set up in our system to access organization resources'
      );
    }

    if (!user.loggedOrganizationId) {
      console.log(
        '❌ Organization guard: User not logged into any organization'
      );
      throw new UnauthorizedException(
        'Organization access required: You must be logged into an organization to access this resource'
      );
    }

    if (!organization) {
      console.log('❌ Organization guard: Organization not found');
      throw new NotFoundException(
        'Organization access denied: Your organization could not be found or may have been suspended'
      );
    }

    console.log(
      `✅ Organization guard: Access granted for user ${user.email} in organization ${organization.name}`
    );

    // Attach to request for controllers and services to use
    request.currentUser = user;
    request.currentOrganization = organization;

    return true;
  }
}
