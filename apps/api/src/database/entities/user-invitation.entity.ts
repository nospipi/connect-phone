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
import { IUserInvitation } from '@connect-phone/shared-types';
import { Organization } from './organization.entity';
import { User } from './user.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('user_invitations')
@Unique(['email', 'organizationId'])
export class UserInvitation implements IUserInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  invitedById: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'invitedById' })
  invitedBy: User;
}
