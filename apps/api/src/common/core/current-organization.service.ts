// src/common/core/current-organization.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

@Injectable({ scope: Scope.REQUEST })
export class CurrentOrganizationService {
  private _currentOrganization: Organization | null = null;
  private _currentUser: User | null = null;
  private _organizationLoaded = false;
  private _userLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {}

  /**
   * Gets the current user's email from Clerk
   */
  private getClerkUserEmail(): string | null {
    const user = this.request.user as
      | {
          primaryEmailAddress?: {
            emailAddress?: string;
          };
        }
      | undefined;

    return user?.primaryEmailAddress?.emailAddress || null;
  }

  /**
   * Gets the current user from the database
   * Returns null if not found - no errors thrown
   */
  async getCurrentUser(): Promise<User | null> {
    if (this._userLoaded) {
      return this._currentUser;
    }

    const email = this.getClerkUserEmail();
    if (!email) {
      this._userLoaded = true;
      this._currentUser = null;
      return null;
    }

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['loggedOrganization'],
      });

      this._currentUser = user;
      this._userLoaded = true;
      return user;
    } catch (error) {
      console.error('Error fetching user from database:', error);
      this._userLoaded = true;
      this._currentUser = null;
      return null;
    }
  }

  /**
   * Gets the current organization for the logged-in user
   * Returns null if not found - no errors thrown
   */
  async getCurrentOrganization(): Promise<Organization | null> {
    if (this._organizationLoaded) {
      return this._currentOrganization;
    }

    const user = await this.getCurrentUser();
    if (!user) {
      this._organizationLoaded = true;
      this._currentOrganization = null;
      return null;
    }

    if (!user.loggedOrganizationId) {
      this._organizationLoaded = true;
      this._currentOrganization = null;
      return null;
    }

    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: user.loggedOrganizationId },
        relations: ['salesChannels', 'users'],
      });

      this._currentOrganization = organization;
      this._organizationLoaded = true;
      return organization;
    } catch (error) {
      console.error('Error fetching organization from database:', error);
      this._organizationLoaded = true;
      this._currentOrganization = null;
      return null;
    }
  }

  /**
   * Gets current user and organization info for debugging/context
   */
  async getCurrentContext() {
    const [user, organization] = await Promise.all([
      this.getCurrentUser(),
      this.getCurrentOrganization(),
    ]);

    return {
      user: user
        ? { id: user.id, email: user.email, fullName: user.fullName }
        : null,
      organization: organization
        ? { id: organization.id, name: organization.name }
        : null,
      hasUser: !!user,
      hasOrganization: !!organization,
      userHasOrgId: !!user?.loggedOrganizationId,
    };
  }
}
