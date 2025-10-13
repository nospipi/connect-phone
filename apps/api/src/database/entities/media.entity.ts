// apps/api/src/database/entities/media.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IMedia, IOrganization } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';

@Entity({ name: 'media' })
export class MediaEntity implements IMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column()
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.media)
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
