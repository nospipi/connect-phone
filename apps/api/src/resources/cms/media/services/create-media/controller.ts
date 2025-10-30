// apps/api/src/resources/cms/media/services/create-media/controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMediaService } from './service';
import { CreateMediaDto } from './create-media.dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { FileValidationPipe } from '../../../../../common/pipes/file-validation.pipe';
import { IMedia, IUploadedFile } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class CreateMediaController {
  constructor(private readonly createMediaService: CreateMediaService) {}

  @Post('new')
  @UseInterceptors(FileInterceptor('file'))
  async createMedia(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 1 * 1024 * 1024,
        allowedMimeTypes: ['image/'],
        required: true,
      })
    )
    file: IUploadedFile,
    @Body() createMediaDto: CreateMediaDto
  ): Promise<IMedia> {
    return this.createMediaService.createMedia(file, createMediaDto);
  }
}
