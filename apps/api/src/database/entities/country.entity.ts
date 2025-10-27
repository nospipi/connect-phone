// apps/api/src/database/entities/country.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ICountry, CountryRegion } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';
import { IOrganization } from '@connect-phone/shared-types';

//-------------------------------------------------------

@Entity({ name: 'countries' })
export class CountryEntity implements ICountry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  flagAvatarUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  flagProductImageUrl: string | null;

  @Column({
    type: 'enum',
    enum: CountryRegion,
  })
  region: CountryRegion;

  @Column()
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.countries)
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
