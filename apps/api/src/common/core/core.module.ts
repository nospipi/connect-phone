// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextService } from './request-context.service';
import { CurrentOrganizationService } from './current-organization.service';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentClerkUserService } from './current-clerk-user.service';
import { OrganizationContextService } from './organization-context.service';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [
    RequestContextService,
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    OrganizationContextService,
  ],
  exports: [
    RequestContextService,
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    OrganizationContextService,
  ],
})
export class CoreModule {}
