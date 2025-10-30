// apps/api/src/common/core/core.module.ts

import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { CurrentOrganizationIdService } from '@/common/services/current-organization-id.service';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import { CurrentClerkUserService } from '@/common/services/current-clerk-user.service';
import { CurrentDbUserRoleService } from '@/common/services/current-db-user-role.service';
import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { AuditLogEntryEntity } from '@/database/entities/audit-log.entity';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { CountryEntity } from '@/database/entities/country.entity';
import { PriceEntity } from '@/database/entities/price.entity';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { MediaEntity } from '@/database/entities/media.entity';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';

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
      EsimOfferEntity,
      CountryEntity,
      PriceEntity,
      DateRangeEntity,
      MediaEntity,
      OfferInclusionEntity,
      OfferExclusionEntity,
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
