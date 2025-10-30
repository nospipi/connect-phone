// apps/api/src/resources/organizations/organizations.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from '@/database/entities/organization.entity';

// controllers
import { GetCurrentOrganizationController } from '../organizations/services/get-current-organization/controller';
import { UpdateOrganizationController } from '../organizations/services/update-organization/controller';
import { DeleteAllCacheController } from '../organizations/services/delete-all-cache/controller';

// services
import { GetCurrentOrganizationService } from '../organizations/services/get-current-organization/service';
import { UpdateOrganizationService } from '../organizations/services/update-organization/service';
import { DeleteAllCacheService } from '../organizations/services/delete-all-cache/service';

//------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
  controllers: [
    GetCurrentOrganizationController,
    UpdateOrganizationController,
    DeleteAllCacheController,
  ],
  providers: [
    GetCurrentOrganizationService,
    UpdateOrganizationService,
    DeleteAllCacheService,
  ],
})
export class OrganizationsModule {}
