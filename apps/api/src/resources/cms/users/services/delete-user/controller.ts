// apps/api/src/resources/cms/users/services/delete-user/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DeleteUserService } from './service';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IUser } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<IUser> {
    try {
      const deletedUser = await this.deleteUserService.deleteUserById(id);
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
