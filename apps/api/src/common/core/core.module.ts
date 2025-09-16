// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentOrganizationService } from './current-organization.service';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentClerkUserService } from './current-clerk-user.service';
import { CurrentDbUserRoleService } from './current-db-user-role.service';

import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { AuditLogEntry } from '@/database/entities/audit-log.entity';
import { UserInvitation } from '@/database/entities/user-invitation.entity';
import { UserOrganization } from '@/database/entities/user-organization.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organization,
      SalesChannel,
      AuditLogEntry,
      UserInvitation,
      UserOrganization,
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
