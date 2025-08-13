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

  // 1) Raw FK column for direct read/write
  @Column({ name: 'loggedOrganizationId', type: 'int', nullable: true })
  loggedOrganizationId: number | null;

  // Note: `loggedOrganization` is not stored directly in the `users` table —
  // it's a relation mapped via `loggedOrganizationId` to the `organizations` table.
  // To get the actual `Organization` entity in results, you must either:
  // 1) Load it explicitly in queries: `userRepo.find({ relations: ['loggedOrganization'] })`
  // 2) Mark the relation as eager: `{ eager: true }` in the @ManyToOne decorator.
  //so it can be returned at all find operations

  // 2) Relation to the Organization entity
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'loggedOrganizationId' })
  loggedOrganization: Organization | null;

  @ManyToMany(() => Organization, (organization) => organization.users)
  @JoinTable({
    name: 'user_organizations', // Custom junction table name
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
