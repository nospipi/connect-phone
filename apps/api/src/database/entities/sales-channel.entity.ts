import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  Unique,
} from 'typeorm';
import { SalesChannel as ISalesChannel } from '@connect-phone/shared-types';
import { Organization } from './organization.entity';

@Entity('sales_channels')
@Unique(['name', 'organizationId'])
export class SalesChannel implements ISalesChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  organizationId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null | undefined;

  @ManyToOne(() => Organization, (organization) => organization.salesChannels)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  // @AfterLoad()
  // logSalesChannelLoad() {
  //   console.log(`MIDDLEWARE TEST: ${this.name}`);
  // }
}
