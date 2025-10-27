// apps/api/src/common/guards/db-user-role.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  Scope,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentDbUserRoleService } from '../services/current-db-user-role.service';
import { UserOrganizationRole } from '@/database/entities/user-organization.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

//----------------------------------------------------------------------

/**
 * Database User Role Guard Factory
 *
 * This creates role-based guards that can accept roles as parameters
 *
 * Usage:
 * - @UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
 * - @UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
 * - Only accepts valid role strings: 'ADMIN' | 'OPERATOR'
 * - Automatically skipped for @Public() routes
 */

type ValidRoleString = keyof typeof UserOrganizationRole;

export function DbUserRoleGuard(
  ...allowedRoles: ValidRoleString[]
): Type<CanActivate> {
  @Injectable({ scope: Scope.REQUEST })
  class RoleGuard implements CanActivate {
    private readonly logger = new Logger(RoleGuard.name);

    constructor(
      private readonly reflector: Reflector,
      private readonly currentDbUserRoleService: CurrentDbUserRoleService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (isPublic) {
        this.logger.log('🌍 Public route - skipping role requirement');
        return true;
      }

      if (!allowedRoles || allowedRoles.length === 0) {
        this.logger.log('🔓 No role restrictions specified - allowing access');
        return true;
      }

      const enumRoles = allowedRoles.map((role) => UserOrganizationRole[role]);

      this.logger.log(
        `🔒👑 Role guard: Checking for roles: ${enumRoles.join(', ')}`
      );

      const userRole =
        await this.currentDbUserRoleService.getCurrentDbUserRole();

      if (!userRole) {
        this.logger.error('❌ Role guard: User role not found');
        throw new ForbiddenException(
          'Role access denied: Unable to determine your role in this organization'
        );
      }

      if (!enumRoles.includes(userRole)) {
        this.logger.error(
          `❌ Role guard: User role '${userRole}' not in required roles [${enumRoles.join(', ')}]`
        );
        throw new ForbiddenException(
          `Role access denied: This action requires ${enumRoles.join(' or ')} role. You have ${userRole} role.`
        );
      }

      this.logger.log(
        `🔒👑 Role guard: Access granted for user with role '${userRole}'`
      );

      return true;
    }
  }

  return RoleGuard;
}
