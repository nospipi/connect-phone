// src/common/guards/organization.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentOrganizationService } from '../services/current-organization.service';
import { CurrentDbUserService } from '../services/current-db-user.service';
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

@Injectable({ scope: Scope.REQUEST })
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

    console.log(
      '🔒🏢 Organization guard: Enforcing organization requirement...'
    );

    const [user, organization] = await Promise.all([
      this.currentDbUserService.getCurrentDbUser(),
      this.currentOrganizationService.getCurrentOrganization(),
    ]);

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

    const belongsToOrganization = user.userOrganizations?.some(
      (uo) => uo.organizationId === organization.id
    );

    if (!belongsToOrganization) {
      console.log(
        `❌ Organization guard: User ${user.email} is not part of organization ${organization.name}`
      );
      throw new UnauthorizedException(
        'Organization access denied: You do not belong to this organization'
      );
    }

    console.log(
      `🔒🏢 Organization guard: Access granted for user ${user.email} in organization ${organization.name} (ID: ${organization.id})`
    );

    // Attach to request
    request.currentUser = user;
    request.currentOrganization = organization;

    return true;
  }
}
