// apps/api/src/database/entities/offer.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import {
  IEsimOffer,
  IOrganization,
  IOfferInclusion,
  IOfferExclusion,
  IMedia,
  ICountry,
  ISalesChannel,
  IPrice,
} from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';
import { OfferInclusionEntity } from './offer-inclusion.entity';
import { OfferExclusionEntity } from './offer-exclusion.entity';
import { MediaEntity } from './media.entity';
import { CountryEntity } from './country.entity';
import { SalesChannelEntity } from './sales-channel.entity';
import { PriceEntity } from './price.entity';

//----------------------------------------------------------------------

@Entity({ name: 'esim_offers' })
export class EsimOfferEntity implements IEsimOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  descriptionHtml: string;

  @Column({ type: 'text' })
  descriptionText: string;

  @Column({ type: 'int' })
  durationInDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dataInGb: number;

  @Column()
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.offers)
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @ManyToMany(() => OfferInclusionEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_inclusions',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'offerInclusionId',
      referencedColumnName: 'id',
    },
  })
  inclusions: IOfferInclusion[];

  @ManyToMany(() => OfferExclusionEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_exclusions',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'offerExclusionId',
      referencedColumnName: 'id',
    },
  })
  exclusions: IOfferExclusion[];

  @Column({ nullable: true })
  mainImageId: number | null;

  @ManyToOne(() => MediaEntity, { nullable: true })
  @JoinColumn({ name: 'mainImageId' })
  mainImage: IMedia | null;

  @ManyToMany(() => MediaEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_images',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'mediaId', referencedColumnName: 'id' },
  })
  images: IMedia[];

  @ManyToMany(() => CountryEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_countries',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'countryId', referencedColumnName: 'id' },
  })
  countries: ICountry[];

  @ManyToMany(() => SalesChannelEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_sales_channels',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'salesChannelId',
      referencedColumnName: 'id',
    },
  })
  salesChannels: ISalesChannel[];

  @ManyToMany(() => PriceEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'esim_offer_prices',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'priceId', referencedColumnName: 'id' },
  })
  prices: IPrice[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
