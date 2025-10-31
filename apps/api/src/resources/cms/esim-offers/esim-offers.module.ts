// apps/api/src/resources/cms/esim-offers/esim-offers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsimOfferEntity } from '@/database/entities/esim-offer.entity';
import { CreateEsimOfferController } from './services/create-esim-offer/controller';
import { CreateEsimOfferService } from './services/create-esim-offer/service';
import { DeleteEsimOfferController } from './services/delete-esim-offer/controller';
import { DeleteEsimOfferService } from './services/delete-esim-offer/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { UpdateEsimOfferController } from './services/update-esim-offer/controller';
import { UpdateEsimOfferService } from './services/update-esim-offer/service';
import { GetEsimOfferByIdController } from './services/get-esim-offer-by-id/controller';
import { GetEsimOfferByIdService } from './services/get-esim-offer-by-id/service';
import { GetEsimOffersByIdsController } from './services/get-by-ids/controller';
import { GetEsimOffersByIdsService } from './services/get-by-ids/service';

//------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([EsimOfferEntity])],
  controllers: [
    CreateEsimOfferController,
    DeleteEsimOfferController,
    GetAllByOrgPaginatedController,
    UpdateEsimOfferController,
    GetEsimOffersByIdsController,
    GetEsimOfferByIdController,
  ],
  providers: [
    CreateEsimOfferService,
    DeleteEsimOfferService,
    GetAllByOrgPaginatedService,
    UpdateEsimOfferService,
    GetEsimOffersByIdsService,
    GetEsimOfferByIdService,
  ],
})
export class EsimOffersModule {}
