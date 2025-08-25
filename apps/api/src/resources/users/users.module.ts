// apps/api/src/resources/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/database/entities/user.entity';
import { Organization } from '@/database/entities/organization.entity';
import { UserOrganization } from '@/database/entities/user-organization.entity';
import { GetAllOrganizationsOfUserController } from './services/get-all-organizations-of-user/controller';
import { GetAllOrganizationsOfUserService } from './services/get-all-organizations-of-user/service';
import { LogUserInOrganizationController } from './services/log-user-in-organization/controller';
import { LogUserInOrganizationService } from './services/log-user-in-organization/service';
import { IsUserLoggedInOrganizationController } from './services/is-user-logged-in-organization/controller';
import { IsUserLoggedInOrganizationService } from './services/is-user-logged-in-organization/service';
import { GetUserLoggedInOrganizationController } from './services/get-user-logged-in-organization/controller';
import { GetUserLoggedInOrganizationService } from './services/get-user-logged-in-organization/service';
import { CurrentDbUserService } from '@/common/core/current-db-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, UserOrganization])],
  controllers: [
    GetAllOrganizationsOfUserController,
    LogUserInOrganizationController,
    IsUserLoggedInOrganizationController,
    GetUserLoggedInOrganizationController,
  ],
  providers: [
    GetAllOrganizationsOfUserService,
    LogUserInOrganizationService,
    IsUserLoggedInOrganizationService,
    GetUserLoggedInOrganizationService,
    CurrentDbUserService,
  ],
})
export class UsersModule {}
