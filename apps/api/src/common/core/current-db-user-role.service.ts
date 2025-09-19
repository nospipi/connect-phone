// src/common/core/current-db-user-role.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  UserOrganizationEntity,
  //UserOrganizationRole,
} from '../../database/entities/user-organization.entity';
import {
  IUserOrganization,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentOrganizationService } from './current-organization.service';

//------------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentDbUserRoleService {
  private _currentRole: UserOrganizationRole | null = null;
  private _roleLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(UserOrganizationEntity)
    private readonly userOrganizationRepository: Repository<UserOrganizationEntity>,
    private readonly currentDbUserService: CurrentDbUserService,
    private readonly currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Gets the current user's role in the current organization
   * Returns null if not found - no errors thrown
   */
  async getCurrentDbUserRole(): Promise<UserOrganizationRole | null> {
    if (this._roleLoaded) {
      return this._currentRole;
    }

    const [user, organization] = await Promise.all([
      this.currentDbUserService.getCurrentDbUser(),
      this.currentOrganizationService.getCurrentOrganization(),
    ]);

    if (!user || !organization) {
      this._roleLoaded = true;
      this._currentRole = null;
      return null;
    }

    try {
      const userOrganization = await this.userOrganizationRepository.findOne({
        where: {
          userId: user.id,
          organizationId: organization.id,
        },
      });

      this._currentRole = userOrganization?.role || null;
      this._roleLoaded = true;
      return this._currentRole;
    } catch (error) {
      console.error('Error fetching user role from database:', error);
      this._roleLoaded = true;
      this._currentRole = null;
      return null;
    }
  }

  /**
   * Convenience method to check if current user is an admin
   */
  async isCurrentUserAdmin(): Promise<boolean> {
    const role = await this.getCurrentDbUserRole();
    return role === UserOrganizationRole.ADMIN;
  }

  /**
   * Convenience method to check if current user is an operator
   */
  async isCurrentUserOperator(): Promise<boolean> {
    const role = await this.getCurrentDbUserRole();
    return role === UserOrganizationRole.OPERATOR;
  }
}
