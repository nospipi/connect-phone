// apps/api/src/database/entities/organization.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import {
  IOrganization,
  IAuditLog,
  ISalesChannel,
  IUserOrganization,
  ICountry,
  IPrice,
  IDateRange,
  IMedia,
  Currency,
  IOfferInclusion,
  IOfferExclusion,
} from '@connect-phone/shared-types';
import { SalesChannelEntity } from './sales-channel.entity';
import { UserOrganizationEntity } from './user-organization.entity';
import { AuditLogEntryEntity } from './audit-log.entity';
import { CountryEntity } from './country.entity';
import { PriceEntity } from './price.entity';
import { DateRangeEntity } from './date-range.entity';
import { MediaEntity } from './media.entity';
import { OfferInclusionEntity } from './offer-inclusion.entity';
import { OfferExclusionEntity } from './offer-exclusion.entity';

//----------------------------------------------------------------------

@Entity({ name: 'organizations' })
export class OrganizationEntity implements IOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  slug: string;

  @Column({ nullable: true })
  logoId: number | null;

  @ManyToOne(() => MediaEntity, { nullable: true })
  @JoinColumn({ name: 'logoId' })
  logo: MediaEntity | null;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  mainCurrency: Currency;

  @OneToMany(
    () => SalesChannelEntity,
    (salesChannel) => salesChannel.organization
  )
  salesChannels: ISalesChannel[];

  @OneToMany(() => UserOrganizationEntity, (userOrg) => userOrg.organization)
  userOrganizations: IUserOrganization[];

  @OneToMany(() => AuditLogEntryEntity, (auditLog) => auditLog.organization)
  auditLogs: IAuditLog[];

  @OneToMany(() => CountryEntity, (country) => country.organization)
  countries: ICountry[];

  @OneToMany(() => PriceEntity, (price) => price.organization)
  prices: IPrice[];

  @OneToMany(() => DateRangeEntity, (dateRange) => dateRange.organization)
  dateRanges: IDateRange[];

  @OneToMany(() => MediaEntity, (media) => media.organization)
  media: IMedia[];

  @OneToMany(
    () => OfferInclusionEntity,
    (offerInclusion) => offerInclusion.organization
  )
  offerInclusions: IOfferInclusion[];

  @OneToMany(
    () => OfferExclusionEntity,
    (offerExclusion) => offerExclusion.organization
  )
  offerExclusions: IOfferExclusion[];
}
