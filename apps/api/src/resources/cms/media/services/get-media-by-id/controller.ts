// apps/api/src/resources/media/services/get-media-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GetMediaByIdService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IMedia } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('media')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetMediaByIdController {
  constructor(private readonly getMediaByIdService: GetMediaByIdService) {}

  @Get(':id')
  async getMediaById(@Param('id', ParseIntPipe) id: number): Promise<IMedia> {
    return this.getMediaByIdService.getMediaById(id);
  }
}
