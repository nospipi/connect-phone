// apps/api/src/resources/media/media.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '@/database/entities/media.entity';

// controllers
import { CreateMediaController } from './services/create-media/controller';

// services
import { CreateMediaService } from './services/create-media/service';

//----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  controllers: [CreateMediaController],
  providers: [CreateMediaService],
})
export class MediaModule {}
