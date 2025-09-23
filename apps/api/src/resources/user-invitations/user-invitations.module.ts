// apps/api/src/resources/user-invitations/user-invitations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { CreateUserInvitationController } from '../user-invitations/services/create-user-invitation/controller';
import { CreateUserInvitationService } from '../user-invitations/services/create-user-invitation/service';
import { GetAllInvitationsOfOrgPaginatedController } from '../user-invitations/services/get-all-invitations-of-org-paginated/controller';
import { GetAllInvitationsOfOrgPaginatedService } from '../user-invitations/services/get-all-invitations-of-org-paginated/service';
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
  ],
  providers: [
    CreateUserInvitationService,
    GetAllInvitationsOfOrgPaginatedService,
  ],
})
export class UserInvitationsModule {}
