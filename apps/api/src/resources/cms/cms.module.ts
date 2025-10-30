// apps/api/src/resources/cms/cms.module.ts

import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SalesChannelsModule } from './sales-channels/sales-channels.module';
import { UsersModule } from './users/users.module';
import { UserInvitationsModule } from './user-invitations/user-invitations.module';
import { CountriesModule } from './countries/countries.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DateRangesModule } from './date-ranges/date-ranges.module';
import { PricesModule } from './prices/prices.module';
import { MediaModule } from './media/media.module';
import { OfferInclusionsModule } from './offer-inclusions/offer-inclusions.module';
import { OfferExclusionsModule } from './offer-exclusions/offer-exclusions.module';
import { EsimOffersModule } from './esim-offers/esim-offers.module';

//------------------------------------------------------------

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'cms',
        children: [
          { path: 'audit-logs', module: AuditLogsModule },
          { path: 'sales-channels', module: SalesChannelsModule },
          { path: 'users', module: UsersModule },
          { path: 'user-invitations', module: UserInvitationsModule },
          { path: 'countries', module: CountriesModule },
          { path: 'organizations', module: OrganizationsModule },
          { path: 'date-ranges', module: DateRangesModule },
          { path: 'prices', module: PricesModule },
          { path: 'media', module: MediaModule },
          { path: 'offer-inclusions', module: OfferInclusionsModule },
          { path: 'offer-exclusions', module: OfferExclusionsModule },
          { path: 'esim-offers', module: EsimOffersModule },
        ],
      },
    ]),
    AuditLogsModule,
    SalesChannelsModule,
    UsersModule,
    UserInvitationsModule,
    CountriesModule,
    OrganizationsModule,
    DateRangesModule,
    PricesModule,
    MediaModule,
    OfferInclusionsModule,
    OfferExclusionsModule,
    EsimOffersModule,
  ],
})
export class CmsModule {}
