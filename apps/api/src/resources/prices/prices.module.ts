// apps/api/src/resources/prices/prices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from '@/database/entities/price.entity';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';

// controllers
import { CreatePriceController } from '../prices/services/create-price/controller';

// services
import { CreatePriceService } from '../prices/services/create-price/service';

//----------------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriceEntity,
      DateRangeEntity,
      SalesChannelEntity,
    ]),
  ],
  controllers: [CreatePriceController],
  providers: [CreatePriceService],
})
export class PricesModule {}
