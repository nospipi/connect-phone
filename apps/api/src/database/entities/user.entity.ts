// src/database/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User as IUser } from '@connect-phone/shared-types';
import { Organization } from './organization.entity';

@Entity({ name: 'users' })
export class User implements IUser {
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

  // Fix: Use @JoinColumn to specify the exact column name
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'loggedOrganizationId' })
  loggedOrganizationId: number | null | undefined;

  @ManyToMany(() => Organization, (organization) => organization.users)
  organizations: Organization[];
}
