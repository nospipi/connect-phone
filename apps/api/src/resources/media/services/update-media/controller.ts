// apps/api/src/resources/media/services/update-media/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateMediaService } from './service';
import { UpdateMediaDto } from './update-media.dto';
import { IMedia } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

//----------------------------------------------------------------------

@Controller('media')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class UpdateMediaController {
  constructor(private readonly updateMediaService: UpdateMediaService) {}

  @Put(':id')
  async updateMedia(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaDto: UpdateMediaDto
  ): Promise<IMedia> {
    updateMediaDto.id = id;
    return this.updateMediaService.updateMedia(updateMediaDto);
  }
}
