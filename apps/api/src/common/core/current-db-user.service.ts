// src/common/core/current-db-user.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';
import { CurrentClerkUserService } from './current-clerk-user.service';

//-------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentDbUserService {
  private _currentUser: User | null = null;
  private _userLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly currentClerkUserService: CurrentClerkUserService
  ) {}

  /**
   * Gets the current user from the database
   * Returns null if not found - no errors thrown
   */
  async getCurrentDbUser(): Promise<User | null> {
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
}
