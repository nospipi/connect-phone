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

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null | undefined;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null | undefined;

  @Column()
  organizationId: number;

  // @AfterLoad()
  // logSalesChannelLoad() {
  //   console.log(`MIDDLEWARE TEST: ${this.name}`);
  // }
}
