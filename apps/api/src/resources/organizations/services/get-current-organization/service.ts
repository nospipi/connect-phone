// apps/api/src/resources/organizations/services/get-current-organization/service.ts
import { Injectable } from '@nestjs/common';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { IOrganization } from '@connect-phone/shared-types';

@Injectable()
export class GetCurrentOrganizationService {
  constructor(private currentOrganizationService: CurrentOrganizationService) {}

  async getCurrentOrganization(): Promise<IOrganization | null> {
    return this.currentOrganizationService.getCurrentOrganization();
  }
}
