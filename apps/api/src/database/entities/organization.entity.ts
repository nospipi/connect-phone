// src/database/entities/organization.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { IOrganization } from '@connect-phone/shared-types';
import { SalesChannelEntity } from './sales-channel.entity';
import { UserOrganizationEntity } from './user-organization.entity';
import { AuditLogEntryEntity } from './audit-log.entity';

@Entity({ name: 'organizations' })
export class OrganizationEntity implements IOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @OneToMany(
    () => SalesChannelEntity,
    (salesChannel) => salesChannel.organization
  )
  salesChannels: SalesChannelEntity[];

  @OneToMany(() => UserOrganizationEntity, (userOrg) => userOrg.organization)
  userOrganizations: UserOrganizationEntity[];

  @OneToMany(() => AuditLogEntryEntity, (auditLog) => auditLog.organization)
  auditLogs: AuditLogEntryEntity[];
}
