// apps/api/src/resources/cms/media/media.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '@/database/entities/media.entity';
import { CreateMediaController } from './services/create-media/controller';
import { CreateMediaService } from './services/create-media/service';
import { GetAllByOrgPaginatedController } from './services/get-all-by-org-paginated/controller';
import { GetAllByOrgPaginatedService } from './services/get-all-by-org-paginated/service';
import { UpdateMediaController } from './services/update-media/controller';
import { UpdateMediaService } from './services/update-media/service';
import { DeleteMediaController } from './services/delete-media/controller';
import { DeleteMediaService } from './services/delete-media/service';
import { GetMediaByIdController } from './services/get-media-by-id/controller';
import { GetMediaByIdService } from './services/get-media-by-id/service';
import { GetMediaByIdsController } from './services/get-by-ids/controller';
import { GetMediaByIdsService } from './services/get-by-ids/service';

//------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  controllers: [
    CreateMediaController,
    GetAllByOrgPaginatedController,
    UpdateMediaController,
    DeleteMediaController,
    GetMediaByIdsController,
    GetMediaByIdController,
  ],
  providers: [
    CreateMediaService,
    GetAllByOrgPaginatedService,
    UpdateMediaService,
    GetMediaByIdsService,
    GetMediaByIdService,
    DeleteMediaService,
  ],
})
export class MediaModule {}
