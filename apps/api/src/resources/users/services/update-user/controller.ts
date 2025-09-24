// apps/api/src/resources/users/services/update-user/controller.ts
import {
  Controller,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateUserService } from './service';
import { UpdateUserDto } from './update-user.dto';
import { IUser } from '@connect-phone/shared-types';
import { DbUserGuard } from '../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

//-------------------------------------------

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put('profile')
  @UseGuards(DbUserGuard)
  async updateProfile(@Body() updateUserDto: UpdateUserDto): Promise<IUser> {
    return this.updateUserService.updateCurrentUser(updateUserDto);
  }

  @Put(':userId')
  @UseGuards(
    DbUserGuard,
    OrganizationGuard,
    DbUserRoleGuard('ADMIN', 'OPERATOR')
  )
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    return this.updateUserService.updateUserById({ ...updateUserDto, userId });
  }
}
