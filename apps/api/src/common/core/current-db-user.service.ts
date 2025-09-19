// src/common/core/current-db-user.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UserEntity } from '../../database/entities/user.entity';
import { OrganizationEntity } from '../../database/entities/organization.entity';
import { CurrentClerkUserService } from './current-clerk-user.service';

//-------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentDbUserService {
  private _currentUser: UserEntity | null = null;
  private _userLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    private readonly currentClerkUserService: CurrentClerkUserService
  ) {}

  /**
   * Gets the current user from the database
   * Returns null if not found - no errors thrown
   */
  async getCurrentDbUser(): Promise<UserEntity | null> {
    if (this._userLoaded) {
      return this._currentUser;
    }

    const email = this.currentClerkUserService.getClerkUserEmail();

    if (!email) {
      this._userLoaded = true;
      this._currentUser = null;
      return null;
    }

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: [
          'loggedOrganization',
          'userOrganizations',
          'userOrganizations.organization',
        ],
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
}
