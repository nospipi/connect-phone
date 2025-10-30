// apps/api/src/resources/media/services/get-by-ids/controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GetMediaByIdsService } from './service';
import { GetMediaByIdsQueryDto } from './dto';
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { IMedia } from '@connect-phone/shared-types';

//------------------------------------------------------------

@Controller('media')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN', 'OPERATOR'))
export class GetMediaByIdsController {
  constructor(private readonly getMediaByIdsService: GetMediaByIdsService) {}

  @Get('by-ids')
  async getMediaByIds(
    @Query() query: GetMediaByIdsQueryDto
  ): Promise<IMedia[]> {
    const ids = query.ids
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      throw new BadRequestException('At least one valid ID is required');
    }

    return this.getMediaByIdsService.getMediaByIds(ids);
  }
}
