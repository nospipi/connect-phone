// apps/api/src/database/entities/price.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  IPrice,
  Currency,
  IDateRange,
  ISalesChannel,
} from '@connect-phone/shared-types';
import { DateRangeEntity } from './date-range.entity';
import { SalesChannelEntity } from './sales-channel.entity';

@Entity({ name: 'prices' })
export class PriceEntity implements IPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: Currency;

  @Column({ type: 'boolean', default: false })
  isDateBased: boolean;

  @ManyToMany(() => DateRangeEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'price_date_ranges',
    joinColumn: { name: 'priceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dateRangeId', referencedColumnName: 'id' },
  })
  dateRanges: IDateRange[];

  @ManyToMany(() => SalesChannelEntity, { onDelete: 'RESTRICT' })
  @JoinTable({
    name: 'price_sales_channels',
    joinColumn: { name: 'priceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'salesChannelId', referencedColumnName: 'id' },
  })
  salesChannels: ISalesChannel[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
