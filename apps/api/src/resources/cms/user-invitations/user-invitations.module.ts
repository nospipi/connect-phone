// apps/api/src/resources/cms/user-invitations/user-invitations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { CreateUserInvitationController } from '../user-invitations/services/create-user-invitation/controller';
import { CreateUserInvitationService } from '../user-invitations/services/create-user-invitation/service';
import { GetAllInvitationsOfOrgPaginatedController } from '../user-invitations/services/get-all-invitations-of-org-paginated/controller';
import { GetAllInvitationsOfOrgPaginatedService } from '../user-invitations/services/get-all-invitations-of-org-paginated/service';
import { DeleteUserInvitationController } from '../user-invitations/services/delete-user-invitation/controller';
import { DeleteUserInvitationService } from '../user-invitations/services/delete-user-invitation/service';

//-----------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInvitationEntity,
      OrganizationEntity,
      UserEntity,
    ]),
  ],
  controllers: [
    CreateUserInvitationController,
    GetAllInvitationsOfOrgPaginatedController,
    DeleteUserInvitationController,
  ],
  providers: [
    CreateUserInvitationService,
    GetAllInvitationsOfOrgPaginatedService,
    DeleteUserInvitationService,
  ],
})
export class UserInvitationsModule {}
