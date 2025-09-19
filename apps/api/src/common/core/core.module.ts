// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentOrganizationService } from './current-organization.service';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentClerkUserService } from './current-clerk-user.service';
import { CurrentDbUserRoleService } from './current-db-user-role.service';

import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { AuditLogEntryEntity } from '@/database/entities/audit-log.entity';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';

//-----------------------------------------------------------------

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      SalesChannelEntity,
      AuditLogEntryEntity,
      UserInvitationEntity,
      UserOrganizationEntity,
    ]),
  ],
  providers: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    CurrentDbUserRoleService,
  ],
  exports: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    CurrentDbUserRoleService,
  ],
})
export class CoreModule {}
