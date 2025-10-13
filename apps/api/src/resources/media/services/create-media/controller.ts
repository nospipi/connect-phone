// apps/api/src/resources/media/services/create-media/controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { IMedia } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('media')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateMediaController {
  constructor(private readonly createMediaService: CreateMediaService) {}

  @Post('new')
  @UseInterceptors(FileInterceptor('file'))
  async createMedia(
    @UploadedFile() file: any,
    @Body('description') description?: string
  ): Promise<IMedia> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > 1 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 1MB');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.createMediaService.createMedia(file, description);
  }
}
