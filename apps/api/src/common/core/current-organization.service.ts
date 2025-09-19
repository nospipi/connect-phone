// src/common/core/current-organization.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { OrganizationEntity } from '../../database/entities/organization.entity';
import { CurrentDbUserService } from './current-db-user.service';

//------------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentOrganizationService {
  private _currentOrganization: OrganizationEntity | null = null;
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
  async getCurrentOrganization(): Promise<OrganizationEntity | null> {
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
      console.error('Error fetching organization from database:', error);
      this._organizationLoaded = true;
      this._currentOrganization = null;
      return null;
    }
  }
}
