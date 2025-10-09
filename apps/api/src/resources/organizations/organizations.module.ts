// apps/api/src/resources/organizations/organizations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from '@/database/entities/organization.entity';

// controllers
import { GetCurrentOrganizationController } from '../organizations/services/get-current-organization/controller';
import { UpdateOrganizationController } from '../organizations/services/update-organization/controller';

// services
import { GetCurrentOrganizationService } from '../organizations/services/get-current-organization/service';
import { UpdateOrganizationService } from '../organizations/services/update-organization/service';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
  controllers: [GetCurrentOrganizationController, UpdateOrganizationController],
  providers: [GetCurrentOrganizationService, UpdateOrganizationService],
})
export class OrganizationsModule {}
