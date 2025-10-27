// apps/api/src/common/services/current-organization.service.ts

import { Injectable, Scope, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { OrganizationEntity } from '../../database/entities/organization.entity';
import { IOrganization } from '@connect-phone/shared-types';
import { CurrentDbUserService } from './current-db-user.service';

//------------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentOrganizationService {
  private readonly logger = new Logger(CurrentOrganizationService.name);
  private _currentOrganization: IOrganization | null = null;
  private _organizationLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Gets the current organization for the logged-in user
   * Returns null if not found - no errors thrown
   */
  async getCurrentOrganization(): Promise<IOrganization | null> {
    if (this._organizationLoaded) {
      return this._currentOrganization;
    }

    const user = await this.currentDbUserService.getCurrentDbUser();
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
        relations: ['salesChannels', 'userOrganizations'],
      });

      this._currentOrganization = organization;
      this._organizationLoaded = true;
      return organization;
    } catch (error) {
      this.logger.error('Error fetching organization from database:', error);
      this._organizationLoaded = true;
      this._currentOrganization = null;
      return null;
    }
  }
}
