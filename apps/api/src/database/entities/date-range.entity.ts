// apps/api/src/database/entities/date-range.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IDateRange, IOrganization } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';

//----------------------------------------------------------------------

@Entity({ name: 'date_ranges' })
export class DateRangeEntity implements IDateRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  organizationId: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.dateRanges
  )
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
