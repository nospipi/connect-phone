import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUsers, User } from 'database';
import { getAllUsers } from 'db/dist/index.js';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//https://docs.nestjs.com/pipes
//https://www.youtube.com/watch?v=2gtiffE3__U --WATCH END OF VIDEO FOR GUARDS ON ENDPOINTS (AUTH etc)
//https://www.youtube.com/watch?v=i-howKMrtCM --> AUTHENTICATION
//https://www.youtube.com/watch?v=DG0uZ0E8DBs --> API DOCUMENTATION SWAGGER PLUGIN

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      console.log('createUserDto', createUserDto);
      // const createdUser: User = await createUser(createUserDto);

      // return createdUser;
      //return a new promise that simple resolves to string "User created"
      return Promise.resolve('User created');
    } catch (error: unknown) {
      console.log('createUserDto', createUserDto, error);
      const message = (error as Error).message ?? 'An error occurred';
      throw new BadRequestException(message);
    }
  }

  async findAll(): Promise<any> {
    const allUsers = await getAllUsers();

    console.log('allUsers', allUsers);

    return allUsers;
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
