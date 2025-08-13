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
@Unique(['name', 'organization'])
export class SalesChannel implements ISalesChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null | undefined;

  @ManyToOne(() => Organization, (organization) => organization.salesChannels)
  organization: Organization;
}
