//src/database/entities/sales-channel.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  Unique,
} from 'typeorm';
import { ISalesChannel } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';

@Entity('sales_channels')
@Unique(['name', 'organizationId'])
export class SalesChannelEntity implements ISalesChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null | undefined;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null | undefined;

  @Column()
  organizationId: number;

  // Add the relationship to Organization
  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.salesChannels
  )
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // @AfterLoad()
  // logSalesChannelLoad() {
  //   console.log(`MIDDLEWARE TEST: ${this.name}`);
  // }
}
