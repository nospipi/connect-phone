// apps/api/src/database/entities/offer-exclusion.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IOfferExclusion, IOrganization } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';

//----------------------------------------------------------------------

@Entity({ name: 'offer_exclusions' })
export class OfferExclusionEntity implements IOfferExclusion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  body: string;

  @Column()
  organizationId: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.offerExclusions
  )
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
