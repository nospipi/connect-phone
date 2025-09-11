// src/database/entities/audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { IAuditLog } from '@connect-phone/shared-types';

//---------------------------------------------------------------------------

@Entity({ name: 'audit_logs' })
export class AuditLogEntry implements IAuditLog {
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

  @ManyToOne(() => Organization, (organization) => organization.auditLogs, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  @Column({ nullable: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
