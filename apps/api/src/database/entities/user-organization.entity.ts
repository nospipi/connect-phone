// src/database/entities/user-organization.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { IUserOrganization } from '@connect-phone/shared-types';

//----------------------------------------------------------------------------

export enum UserOrganizationRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

@Entity({ name: 'user_organizations' })
@Unique(['user', 'organization'])
export class UserOrganization implements IUserOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userOrganizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(
    () => Organization,
    (organization) => organization.userOrganizations,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: number;

  @Column({
    type: 'enum',
    enum: UserOrganizationRole,
    default: UserOrganizationRole.OPERATOR,
  })
  role: UserOrganizationRole;
}
