// src/database/entities/organization.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Organization as IOrganization } from '@connect-phone/shared-types';
import { SalesChannel } from './sales-channel.entity';
import { User } from './user.entity';

@Entity({ name: 'organizations' })
export class Organization implements IOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @OneToMany(() => SalesChannel, (salesChannel) => salesChannel.organizationId)
  salesChannels: SalesChannel[];

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];
}
