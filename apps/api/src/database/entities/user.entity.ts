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
import { IUser } from '@connect-phone/shared-types';
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

  /**
   * Computed property — not stored in DB.
   * Always returns the latest combination of `firstName` and `lastName`.
   * Updates automatically if either name changes in memory.
   */
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
  }

  @Column({ name: 'loggedOrganizationId', type: 'int', nullable: true })
  loggedOrganizationId: number | null;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'loggedOrganizationId' })
  loggedOrganization: Organization | null;

  @ManyToMany(() => Organization, (organization) => organization.users)
  @JoinTable({
    name: 'user_organizations',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'organizationId',
      referencedColumnName: 'id',
    },
  })
  organizations: Organization[];
}
