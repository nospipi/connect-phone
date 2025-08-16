// src/common/guards/organization-required.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationContextService } from '../core/organization-context.service';
import { REQUIRES_ORGANIZATION_KEY } from '../decorators/requires-organization.decorator';

//----------------------------------------------------------------------

@Injectable()
export class OrganizationRequiredGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationContextService: OrganizationContextService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Always load user and organization context into request
    // This makes the decorators work regardless of @RequiresOrganization()
    const [user, organization] = await Promise.all([
      this.organizationContextService.getCurrentUser(),
      this.organizationContextService.getCurrentOrganization(),
    ]);

    // Attach to request for decorators to use
    request.currentUser = user;
    request.currentOrganization = organization;

    // Check if the route requires organization using the decorator
    const requiresOrganization = this.reflector.getAllAndOverride<boolean>(
      REQUIRES_ORGANIZATION_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If route doesn't require organization, allow access
    if (!requiresOrganization) {
      return true;
    }

    // If route requires organization, validate it exists
    if (!organization) {
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      if (!user.loggedOrganizationId) {
        throw new UnauthorizedException(
          'User is not logged into any organization'
        );
      }
      throw new NotFoundException('Organization not found');
    }

    return true;
  }
}
