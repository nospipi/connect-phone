// apps/api/src/resources/cms/date-ranges/date-ranges.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { CreateDateRangeController } from './services/create-date-range/controller';
import { CreateDateRangeService } from './services/create-date-range/service';
import { DeleteDateRangeController } from './services/delete-date-range/controller';
import { DeleteDateRangeService } from './services/delete-date-range/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { UpdateDateRangeController } from './services/update-date-range/controller';
import { UpdateDateRangeService } from './services/update-date-range/service';
import { GetDateRangeByIdController } from './services/get-date-range-by-id/controller';
import { GetDateRangeByIdService } from './services/get-date-range-by-id/service';
import { GetDateRangesByIdsController } from './services/get-by-ids/controller';
import { GetDateRangesByIdsService } from './services/get-by-ids/service';

//------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([DateRangeEntity])],
  controllers: [
    CreateDateRangeController,
    DeleteDateRangeController,
    GetAllByOrgPaginatedController,
    UpdateDateRangeController,
    GetDateRangesByIdsController,
    GetDateRangeByIdController,
  ],
  providers: [
    CreateDateRangeService,
    DeleteDateRangeService,
    GetAllByOrgPaginatedService,
    UpdateDateRangeService,
    GetDateRangesByIdsService,
    GetDateRangeByIdService,
  ],
})
export class DateRangesModule {}
