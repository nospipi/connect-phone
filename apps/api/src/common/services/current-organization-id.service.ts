// apps/api/src/common/services/current-organization-id.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Request } from 'express';
import { CurrentDbUserService } from './current-db-user.service';

//------------------------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentOrganizationIdService {
  private _currentOrganizationId: number;
  private _organizationIdLoaded = false;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async getCurrentOrganizationId(): Promise<number> {
    if (this._organizationIdLoaded) {
      return this._currentOrganizationId;
    }

    const user = await this.currentDbUserService.getCurrentDbUser();
    if (!user) {
      this._organizationIdLoaded = true;
      this._currentOrganizationId = 0;
      return 0;
    }

    this._currentOrganizationId = user?.loggedOrganizationId || 0;
    this._organizationIdLoaded = true;
    return this._currentOrganizationId;
  }
}
