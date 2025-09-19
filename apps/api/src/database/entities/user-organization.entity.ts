// src/database/entities/user-organization.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrganizationEntity } from './organization.entity';
import { IUserOrganization } from '@connect-phone/shared-types';

//----------------------------------------------------------------------------

export enum UserOrganizationRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

@Entity({ name: 'user_organizations' })
@Unique(['user', 'organization'])
export class UserOrganizationEntity implements IUserOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.userOrganizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.userOrganizations,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @Column()
  organizationId: number;

  @Column({
    type: 'enum',
    enum: UserOrganizationRole,
    default: UserOrganizationRole.OPERATOR,
  })
  role: UserOrganizationRole;
}
