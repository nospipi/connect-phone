/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, BlankUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequiresOrganization } from '../guards/decorators/requires-organization.decorator';
import { CurrentUserOrganizationFromClerk } from 'src/guards/decorators/current-user-organization.decorator';
import { Organization } from '../db.module';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('create_blank')
  createBlankUser(@Body() createBlankUserDto: BlankUserDto) {
    return this.usersService.createBlankUser(createBlankUserDto);
  }

  @Get('logged_user_is_in_db')
  isLoggedUserInDb() {
    return this.usersService.isLoggedUserInDb();
  }

  @Get('logged_user_in_db')
  getLoggedUserFromDb() {
    return this.usersService.getLoggedUserFromDb();
  }

  @Get('test')
  handleTestRoute(): string {
    console.log('Test route has been called');
    return 'Test route has been called';
  }

  @Get('current_user_organization')
  async getCurrentUserOrganization(
    @CurrentUserOrganizationFromClerk()
    organizationPromise: Promise<Organization | null>
  ): Promise<Organization | null> {
    const organization = await organizationPromise;
    return this.usersService.getUserOrganization(organization);
  }

  // @Get()
  // @RequiresOrganization()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
