// src/database/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IUser } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';
import { AuditLogEntryEntity } from './audit-log.entity';
import { UserOrganizationEntity } from './user-organization.entity';
import { Expose } from 'class-transformer';

//----------------------------------------------------------------------------

@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }

  @Column({ name: 'loggedOrganizationId', type: 'int', nullable: true })
  loggedOrganizationId: number | null;

  @ManyToOne(() => OrganizationEntity, { nullable: true })
  @JoinColumn({ name: 'loggedOrganizationId' })
  loggedOrganization: OrganizationEntity | null;

  @OneToMany(() => UserOrganizationEntity, (userOrg) => userOrg.user)
  userOrganizations: UserOrganizationEntity[];

  @OneToMany(() => AuditLogEntryEntity, (auditLog) => auditLog.user)
  auditLogs: AuditLogEntryEntity[];
}
