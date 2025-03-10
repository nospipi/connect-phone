// src/guards/organization-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../db.module';
import { REQUIRES_ORGANIZATION_KEY } from '../decorators/requires-organization.decorator';

//----------------------------------------------------------------------

interface DbQueries {
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string | null | undefined): Promise<User | null>;
  isUserInOrganization(
    userId: number | null | undefined,
    organizationId: number | null | undefined
  ): Promise<boolean>;
}

interface ClerkUser {
  primaryEmailAddress?: {
    emailAddress?: string;
  };
}

//----------------------------------------------------------------------

@Injectable()
export class OrganizationAuthGuard implements CanActivate {
  constructor(
    @Inject('DB') private readonly db: DbQueries,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const organizationId = this.extractOrganizationIdFromHeader(request);

    const requiresOrganization = this.reflector.getAllAndOverride<boolean>(
      REQUIRES_ORGANIZATION_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiresOrganization) {
      return true;
    }

    if (!organizationId) {
      throw new UnauthorizedException('An organization ID was not provided');
    }

    const user = request.user as ClerkUser;
    const email = user?.primaryEmailAddress?.emailAddress || null;
    const userFromDb = await this.db.getUserByEmail(email);

    if (!userFromDb) {
      throw new UnauthorizedException('User not found');
    }

    const isUserInOrganization = await this.db.isUserInOrganization(
      userFromDb?.id,
      organizationId
    );

    console.log('Is user in organization:', isUserInOrganization);

    if (!isUserInOrganization) {
      throw new UnauthorizedException(
        'User does not have access to this organization'
      );
    }
    return true;
  }

  private extractOrganizationIdFromHeader(request: Request): number | null {
    const organizationHeader = request.headers.organization;

    if (!organizationHeader) {
      return null;
    }

    // Headers can be string or string[], handle both cases
    const orgIdStr = Array.isArray(organizationHeader)
      ? organizationHeader[0]
      : organizationHeader;

    const orgId = Number(orgIdStr);

    // Validate that it's a valid number
    if (isNaN(orgId)) {
      return null;
    }

    return orgId;
  }
}
