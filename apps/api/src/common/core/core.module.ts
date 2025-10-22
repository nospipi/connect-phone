// apps/api/src/common/core/core.module.ts

import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentOrganizationService } from './current-organization.service';
import { CurrentOrganizationIdService } from './current-organization-id.service';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentClerkUserService } from './current-clerk-user.service';
import { CurrentDbUserRoleService } from './current-db-user-role.service';
import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { AuditLogEntryEntity } from '@/database/entities/audit-log.entity';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { OfferEntity } from '@/database/entities/offer.entity';

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
      OfferEntity,
    ]),
  ],
  providers: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    CurrentOrganizationIdService,
    CurrentDbUserRoleService,
  ],
  exports: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    CurrentOrganizationIdService,
    CurrentDbUserRoleService,
  ],
})
export class CoreModule {}
