// apps/api/src/resources/users/services/get-user-by-id/controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetUserByIdService } from './service';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { IUserWithOrganizationRole } from '@connect-phone/shared-types';

//--------------------------------------------------------------------------------

@Controller('users')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class GetUserByIdController {
  constructor(private readonly getUserByIdService: GetUserByIdService) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IUserWithOrganizationRole> {
    try {
      const user = await this.getUserByIdService.getUserById(id);
      return user;
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      throw error;
    }
  }
}
