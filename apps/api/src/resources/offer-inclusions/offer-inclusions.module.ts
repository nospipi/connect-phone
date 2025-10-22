// apps/api/src/resources/offer-inclusions/offer-inclusions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { CreateOfferInclusionController } from './services/create-offer-inclusion/controller';
import { CreateOfferInclusionService } from './services/create-offer-inclusion/service';
import { DeleteOfferInclusionController } from './services/delete-offer-inclusion/controller';
import { DeleteOfferInclusionService } from './services/delete-offer-inclusion/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { UpdateOfferInclusionController } from './services/update-offer-inclusion/controller';
import { UpdateOfferInclusionService } from './services/update-offer-inclusion/service';
import { GetOfferInclusionByIdController } from './services/get-offer-inclusion-by-id/controller';
import { GetOfferInclusionByIdService } from './services/get-offer-inclusion-by-id/service';
import { GetAllOfferInclusionsController } from './services/get-all/controller';
import { GetAllOfferInclusionsService } from './services/get-all/service';

//----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([OfferInclusionEntity])],
  controllers: [
    CreateOfferInclusionController,
    DeleteOfferInclusionController,
    GetAllByOrgPaginatedController,
    GetAllOfferInclusionsController,
    UpdateOfferInclusionController,
    GetOfferInclusionByIdController,
  ],
  providers: [
    CreateOfferInclusionService,
    DeleteOfferInclusionService,
    GetAllByOrgPaginatedService,
    GetAllOfferInclusionsService,
    UpdateOfferInclusionService,
    GetOfferInclusionByIdService,
  ],
})
export class OfferInclusionsModule {}
