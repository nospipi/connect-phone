// apps/api/src/database/entities/offer-inclusion.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IOfferInclusion, IOrganization } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';

//----------------------------------------------------------------------

@Entity({ name: 'offer_inclusions' })
export class OfferInclusionEntity implements IOfferInclusion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  body: string;

  @Column()
  organizationId: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.offerInclusions
  )
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
