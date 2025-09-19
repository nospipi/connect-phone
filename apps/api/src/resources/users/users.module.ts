// apps/api/src/resources/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
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
import { CurrentDbUserService } from '../../common/core/current-db-user.service';

//-------------------------------------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      UserOrganizationEntity,
    ]),
  ],
  controllers: [
    GetAllOrganizationsOfUserController,
    LogUserInOrganizationController,
    LogOutUserFromOrganizationController,
    IsUserLoggedInOrganizationController,
    GetUserLoggedInOrganizationController,
    GetAllUsersOfOrgPaginatedController,
  ],
  providers: [
    GetAllOrganizationsOfUserService,
    LogUserInOrganizationService,
    LogOutUserFromOrganizationService,
    IsUserLoggedInOrganizationService,
    GetUserLoggedInOrganizationService,
    GetAllUsersOfOrgPaginatedService,
    CurrentDbUserService,
  ],
})
export class UsersModule {}
