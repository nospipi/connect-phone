// src/common/guards/db-user-role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentDbUserRoleService } from '../core/current-db-user-role.service';
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
  @Injectable()
  class RoleGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly currentDbUserRoleService: CurrentDbUserRoleService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Check if route is marked as public (skips role requirement)
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (isPublic) {
        console.log('🌍 Public route - skipping role requirement');
        return true;
      }

      // If no roles specified in the guard, allow access (no role restriction)
      if (!allowedRoles || allowedRoles.length === 0) {
        console.log('🔓 No role restrictions specified - allowing access');
        return true;
      }

      // Convert string keys to enum values
      const enumRoles = allowedRoles.map((role) => UserOrganizationRole[role]);

      console.log(
        `🔒👑 Role guard: Checking for roles: ${enumRoles.join(', ')}`
      );

      // Get current user's role
      const userRole =
        await this.currentDbUserRoleService.getCurrentDbUserRole();

      if (!userRole) {
        console.log('❌ Role guard: User role not found');
        throw new ForbiddenException(
          'Role access denied: Unable to determine your role in this organization'
        );
      }

      // Check if user's role is in the allowed roles
      if (!enumRoles.includes(userRole)) {
        console.log(
          `❌ Role guard: User role '${userRole}' not in required roles [${enumRoles.join(', ')}]`
        );
        throw new ForbiddenException(
          `Role access denied: This action requires ${enumRoles.join(' or ')} role. You have ${userRole} role.`
        );
      }

      console.log(
        `🔒👑 Role guard: Access granted for user with role '${userRole}'`
      );

      return true;
    }
  }

  return RoleGuard;
}
