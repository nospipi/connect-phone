// apps/api/src/resources/prices/prices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from '@/database/entities/price.entity';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { CreatePriceController } from './services/create-price/controller';
import { CreatePriceService } from './services/create-price/service';
import { DeletePriceController } from './services/delete-price/controller';
import { DeletePriceService } from './services/delete-price/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { GetPriceByIdController } from './services/get-price-by-id/controller';
import { GetPriceByIdService } from './services/get-price-by-id/service';
import { UpdatePriceController } from './services/update-price/controller';
import { UpdatePriceService } from './services/update-price/service';

//----------------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriceEntity,
      DateRangeEntity,
      SalesChannelEntity,
    ]),
  ],
  controllers: [
    CreatePriceController,
    DeletePriceController,
    GetAllByOrgPaginatedController,
    GetPriceByIdController,
    UpdatePriceController,
  ],
  providers: [
    CreatePriceService,
    DeletePriceService,
    GetAllByOrgPaginatedService,
    GetPriceByIdService,
    UpdatePriceService,
  ],
})
export class PricesModule {}
