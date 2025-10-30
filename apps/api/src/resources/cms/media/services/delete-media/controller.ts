// apps/api/src/resources/media/services/delete-media/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteMediaService } from './service';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IMedia } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

@Controller('media')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteMediaController {
  constructor(private readonly deleteMediaService: DeleteMediaService) {}

  @Delete(':id')
  async deleteMedia(@Param('id', ParseIntPipe) id: number): Promise<IMedia> {
    return this.deleteMediaService.deleteMedia(id);
  }
}
