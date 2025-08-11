import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  CreateDateColumn,
} from 'typeorm';
import { SalesChannel as ISalesChannel } from '@connect-phone/shared-types';
import { Organization } from './organization.entity';

@Entity('sales_channels')
export class SalesChannel implements ISalesChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;
  @Column()
  organizationId: number;

  @Column({ nullable: true })
  logoUrl: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @ManyToOne(() => Organization, (organization) => organization.salesChannels)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  // @AfterLoad()
  // logSalesChannelLoad() {
  //   console.log(`MIDDLEWARE TEST: ${this.name}`);
  // }
}
