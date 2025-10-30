// apps/api/src/resources/cms/user-invitations/services/delete-user-invitation/controller.ts
import {
  Controller,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DeleteUserInvitationService } from './service';
import { OrganizationGuard } from '@/common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IUserInvitation } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller()
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class DeleteUserInvitationController {
  constructor(
    private readonly deleteUserInvitationService: DeleteUserInvitationService
  ) {}

  @Delete(':id')
  async deleteUserInvitation(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IUserInvitation> {
    try {
      const deletedInvitation =
        await this.deleteUserInvitationService.deleteUserInvitation(id);
      return deletedInvitation;
    } catch (error) {
      console.error('Error deleting user invitation:', error);
      throw error;
    }
  }
}
