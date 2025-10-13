// apps/api/src/resources/media/media.module.ts
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

//----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  controllers: [
    CreateMediaController,
    GetAllByOrgPaginatedController,
    UpdateMediaController,
    DeleteMediaController,
  ],
  providers: [
    CreateMediaService,
    GetAllByOrgPaginatedService,
    UpdateMediaService,
    DeleteMediaService,
  ],
})
export class MediaModule {}
