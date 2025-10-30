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
import { DbUserGuard } from '../../../../../common/guards/db-user.guard';
import { DbUserRoleGuard } from '../../../../../common/guards/db-user-role.guard';
import { OrganizationGuard } from '../../../../../common/guards/organization.guard';

//-------------------------------------------

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':userId')
  @UseGuards(DbUserGuard, OrganizationGuard, DbUserRoleGuard('ADMIN'))
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<IUser> {
    updateUserDto.id = userId;
    return this.updateUserService.updateUserById(updateUserDto);
  }
}
