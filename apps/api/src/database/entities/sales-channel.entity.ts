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
import { Organization } from './organization.entity';

@Entity('sales_channels')
@Unique(['name', 'organizationId'])
export class SalesChannel implements ISalesChannel {
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
  @ManyToOne(() => Organization, (organization) => organization.salesChannels)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  // @AfterLoad()
  // logSalesChannelLoad() {
  //   console.log(`MIDDLEWARE TEST: ${this.name}`);
  // }
}
