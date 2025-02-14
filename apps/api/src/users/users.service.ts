import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUsers, createUser, createUser1, User } from 'database';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//https://docs.nestjs.com/pipes

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      console.log('createUserDto', createUserDto);
      const createdUser: User = await createUser(createUserDto);

      return createdUser;
    } catch (error: unknown) {
      console.log('createUserDto', createUserDto, error);
      const message = (error as Error).message ?? 'An error occurred';
      throw new BadRequestException(message);
    }
  }

  async findAll(): Promise<User[]> {
    return await getUsers();
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
