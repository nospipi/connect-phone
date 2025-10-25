// apps/api/src/resources/organizations/services/get-current-organization/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { IOrganization } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Injectable()
export class GetCurrentOrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
    private currentDbUserService: CurrentDbUserService
  ) {}

  async getCurrentOrganization(): Promise<IOrganization | null> {
    const user = await this.currentDbUserService.getCurrentDbUser();
    if (!user) {
      return null;
    }

    if (!user.loggedOrganizationId) {
      return null;
    }

    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: user.loggedOrganizationId },
        relations: ['logo'],
      });

      return organization;
    } catch (error) {
      console.error('Error fetching organization from database:', error);
      return null;
    }
  }
}
