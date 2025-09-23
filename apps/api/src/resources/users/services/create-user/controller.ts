// apps/api/src/resources/users/services/create-user/controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateUserService } from './service';
import { CreateUserDto } from './create-user.dto';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';
import { DbUserGuard } from '@/common/guards/db-user.guard';
import { DbUserRoleGuard } from '@/common/guards/db-user-role.guard';
import { IUser } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
@Controller('users')
@UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('new')
  async createNew(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    console.log('createNew Controller:', createUserDto);

    try {
      const newUser = await this.createUserService.createNewUser(createUserDto);
      console.log('New user created:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error after logging it
    }
  }
}
