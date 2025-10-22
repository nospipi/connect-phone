// apps/api/src/resources/offer-exclusions/offer-exclusions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';
import { CreateOfferExclusionController } from './services/create-offer-exclusion/controller';
import { CreateOfferExclusionService } from './services/create-offer-exclusion/service';
import { DeleteOfferExclusionController } from './services/delete-offer-exclusion/controller';
import { DeleteOfferExclusionService } from './services/delete-offer-exclusion/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { UpdateOfferExclusionController } from './services/update-offer-exclusion/controller';
import { UpdateOfferExclusionService } from './services/update-offer-exclusion/service';
import { GetOfferExclusionByIdController } from './services/get-offer-exclusion-by-id/controller';
import { GetOfferExclusionByIdService } from './services/get-offer-exclusion-by-id/service';

//----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([OfferExclusionEntity])],
  controllers: [
    CreateOfferExclusionController,
    DeleteOfferExclusionController,
    GetAllByOrgPaginatedController,
    UpdateOfferExclusionController,
    GetOfferExclusionByIdController,
  ],
  providers: [
    CreateOfferExclusionService,
    DeleteOfferExclusionService,
    GetAllByOrgPaginatedService,
    UpdateOfferExclusionService,
    GetOfferExclusionByIdService,
  ],
})
export class OfferExclusionsModule {}
