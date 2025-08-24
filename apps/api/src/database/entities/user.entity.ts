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
import { Organization } from './organization.entity';
import { UserOrganization } from './user-organization.entity';

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

  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }

  @Column({ name: 'loggedOrganizationId', type: 'int', nullable: true })
  loggedOrganizationId: number | null;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'loggedOrganizationId' })
  loggedOrganization: Organization | null;

  // --- updated relation to UserOrganization ---
  @OneToMany(() => UserOrganization, (userOrg) => userOrg.user)
  userOrganizations: UserOrganization[];
}
