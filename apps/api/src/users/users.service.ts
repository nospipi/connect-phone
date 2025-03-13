import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto, BlankUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestContextService } from '../core/request-context.service';
import { User, Organization } from '../db.module';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//https://docs.nestjs.com/pipes
//https://www.youtube.com/watch?v=2gtiffE3__U --WATCH END OF VIDEO FOR GUARDS ON ENDPOINTS (AUTH etc)
//https://www.youtube.com/watch?v=i-howKMrtCM --> AUTHENTICATION
//https://www.youtube.com/watch?v=DG0uZ0E8DBs --> API DOCUMENTATION SWAGGER PLUGIN

interface DbQueries {
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User | null>;
  createBlankUser(createBlankUserDto: BlankUserDto): Promise<User>;
  getOrganizationById(organizationId: number): Promise<Organization | null>;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('DB') private readonly db: DbQueries,
    private readonly requestContext: RequestContextService
  ) {}

  async createBlankUser(createBlankUserDto: BlankUserDto) {
    try {
      console.log('Creating blank user:', createBlankUserDto);
      const newBlankUser = await this.db.createBlankUser(createBlankUserDto);
      console.log('newBlankUser:', newBlankUser);
      return newBlankUser;
    } catch (error: unknown) {
      let errorMessage = 'An error occurred while creating the user';
      if (error && typeof error === 'object' && 'detail' in error) {
        errorMessage = error.detail as string;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('createUserDto', createUserDto);
      // const createdUser: User = await createUser(createUserDto);
      return Promise.resolve('User created');
    } catch (error: unknown) {
      console.log('createUserDto', createUserDto, error);
      const message = (error as Error).message ?? 'An error occurred';
      throw new BadRequestException(message);
    }
  }

  async isLoggedUserInDb(): Promise<boolean | null> {
    const currentUserEmail = this.requestContext.getEmail();
    const user = await this.db.getUserByEmail(currentUserEmail || '');
    return user ? true : null;
  }

  async getLoggedUserFromDb(): Promise<User | null> {
    const currentUserEmail = this.requestContext.getEmail();
    const user = await this.db.getUserByEmail(currentUserEmail || '');
    return user || null;
  }

  async getUserOrganization(
    organization: Organization | null
  ): Promise<Organization | null> {
    const organizationId = organization?.id;
    const organizationFromDb = await this.db.getOrganizationById(
      organizationId || 0
    );

    return organizationFromDb || null;
  }

  //--------------------------------------------

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
