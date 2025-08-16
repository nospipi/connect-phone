// src/common/core/organization-context.service.ts
import {
  Injectable,
  Scope,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrganizationContextService {
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
   * Gets the current organization and throws an error if not found
   */
  async getRequiredOrganization(): Promise<Organization> {
    const organization = await this.getCurrentOrganization();

    if (!organization) {
      const user = await this.getCurrentUser();
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

  /**
   * Gets the current user and throws an error if not found
   */
  async getRequiredUser(): Promise<User> {
    const user = await this.getCurrentUser();

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    return user;
  }
}
