// src/common/decorators/current-organization.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

//--------------------------------------------

/**
 * Decorator to inject the current organization into a controller method.
 * Returns the organization or null if not found.
 *
 * Usage:
 * @Get()
 * @UseGuards(OrganizationRequiredGuard) // Required for context loading
 * async myMethod(@CurrentOrganization() org: Organization | null) {
 *   // org will be null if user has no logged organization
 * }
 */
export const CurrentOrganization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentOrganization || null;
  }
);

/**
 * Decorator to inject the current organization into a controller method.
 * Throws an error if organization is not found.
 *
 * Usage:
 * @Get()
 * @UseGuards(OrganizationRequiredGuard) // Required for context loading
 * async myMethod(@RequiredOrganization() org: Organization) {
 *   // org will always be a valid Organization object or an error will be thrown
 * }
 */
export const RequiredOrganization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const organization = request.currentOrganization;

    if (!organization) {
      const user = request.currentUser;
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

    return organization;
  }
);

/**
 * Decorator to inject the current user from database into a controller method.
 * Returns the user or null if not found.
 *
 * Usage:
 * @Get()
 * @UseGuards(OrganizationRequiredGuard) // Required for context loading
 * async myMethod(@CurrentDbUser() user: User | null) {
 *   // user will be null if user not found in database
 * }
 */
export const CurrentDbUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser || null;
  }
);

/**
 * Decorator to inject the current user from database into a controller method.
 * Throws an error if user is not found.
 *
 * Usage:
 * @Get()
 * @UseGuards(OrganizationRequiredGuard) // Required for context loading
 * async myMethod(@RequiredDbUser() user: User) {
 *   // user will always be a valid User object or an error will be thrown
 * }
 */
export const RequiredDbUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    return user;
  }
);
