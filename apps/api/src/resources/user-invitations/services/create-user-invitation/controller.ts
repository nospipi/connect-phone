// apps/api/src/resources/users/services/create-user-invitation/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateUserInvitationService } from './service';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IUserInvitation } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller('invitations')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class CreateUserInvitationController {
  constructor(
    private readonly createUserInvitationService: CreateUserInvitationService
  ) {}

  @Post('new')
  async createUserInvitation(
    @Body() createUserInvitationDto: CreateUserInvitationDto
  ): Promise<IUserInvitation> {
    try {
      const newUserInvitation =
        await this.createUserInvitationService.createUserInvitation(
          createUserInvitationDto
        );
      return newUserInvitation;
    } catch (error) {
      console.error('Error creating user invitation:', error);
      throw error;
    }
  }
}
