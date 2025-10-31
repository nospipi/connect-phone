// apps/api/src/database/entities/audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IUser } from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';
import { IAuditLog, IOrganization } from '@connect-phone/shared-types';

//---------------------------------------------------------------------------

@Entity({ name: 'audit_logs' })
export class AuditLogEntryEntity implements IAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_name: string;

  @Column()
  row_id: string;

  @Column()
  operation: string;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, any> | null;

  @Column({ nullable: true })
  organizationId: number | null;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.auditLogs,
    {
      nullable: true,
    }
  )
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization | null;

  @Column({ nullable: true })
  userId: number | null;

  @ManyToOne(() => UserEntity, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: IUser | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
