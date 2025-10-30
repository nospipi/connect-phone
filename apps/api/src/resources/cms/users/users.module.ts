// apps/api/src/resources/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { GetAllOrganizationsOfUserController } from './services/get-all-organizations-of-user/controller';
import { GetAllOrganizationsOfUserService } from './services/get-all-organizations-of-user/service';
import { LogUserInOrganizationController } from './services/log-user-in-organization/controller';
import { LogUserInOrganizationService } from './services/log-user-in-organization/service';
import { LogOutUserFromOrganizationController } from './services/log-out-user-from-organization/controller';
import { LogOutUserFromOrganizationService } from './services/log-out-user-from-organization/service';
import { IsUserLoggedInOrganizationController } from './services/is-user-logged-in-organization/controller';
import { IsUserLoggedInOrganizationService } from './services/is-user-logged-in-organization/service';
import { GetUserLoggedInOrganizationController } from './services/get-user-logged-in-organization/controller';
import { GetUserLoggedInOrganizationService } from './services/get-user-logged-in-organization/service';
import { GetAllUsersOfOrgPaginatedController } from './services/get-all-users-of-org-paginated/controller';
import { GetAllUsersOfOrgPaginatedService } from './services/get-all-users-of-org-paginated/service';
import { GetUserByIdController } from './services/get-user-by-id/controller';
import { GetUserByIdService } from './services/get-user-by-id/service';
import { UpdateUserController } from './services/update-user/controller';
import { UpdateUserService } from './services/update-user/service';
import { DeleteUserController } from './services/delete-user/controller';
import { DeleteUserService } from './services/delete-user/service';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//-------------------------------------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      UserOrganizationEntity,
      UserInvitationEntity,
    ]),
  ],
  controllers: [
    GetAllOrganizationsOfUserController,
    LogUserInOrganizationController,
    LogOutUserFromOrganizationController,
    IsUserLoggedInOrganizationController,
    GetUserLoggedInOrganizationController,
    GetAllUsersOfOrgPaginatedController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    GetAllOrganizationsOfUserService,
    LogUserInOrganizationService,
    LogOutUserFromOrganizationService,
    IsUserLoggedInOrganizationService,
    GetUserLoggedInOrganizationService,
    GetAllUsersOfOrgPaginatedService,
    GetUserByIdService,
    UpdateUserService,
    DeleteUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
  ],
})
export class UsersModule {}
