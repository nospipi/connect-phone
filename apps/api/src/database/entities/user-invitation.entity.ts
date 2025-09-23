// src/database/entities/user-invitation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import {
  IUserInvitation,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';
import { IUser, IOrganization } from '@connect-phone/shared-types';

@Entity('user_invitations')
@Unique(['email', 'organizationId'])
export class UserInvitationEntity implements IUserInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: UserOrganizationRole,
    default: UserOrganizationRole.OPERATOR,
  })
  role: UserOrganizationRole;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column()
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, { nullable: false })
  @JoinColumn({ name: 'organizationId' })
  organization: IOrganization;

  @Column()
  invitedById: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'invitedById' })
  invitedBy: IUser;
}
