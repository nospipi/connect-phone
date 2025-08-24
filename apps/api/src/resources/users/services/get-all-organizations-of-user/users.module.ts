// apps/api/src/resources/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/database/entities/user.entity';
import { Organization } from '@/database/entities/organization.entity';
import { GetAllOrganizationsOfUserController } from './controller';
import { GetAllOrganizationsOfUserService } from './service';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  controllers: [GetAllOrganizationsOfUserController],
  providers: [GetAllOrganizationsOfUserService],
})
export class UsersModule {}
