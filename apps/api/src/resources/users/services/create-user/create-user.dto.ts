// apps/api/src/resources/users/services/create-user/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { IUser, UserOrganizationRole } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------------

type CreateUser = Pick<IUser, 'email' | 'firstName' | 'lastName'> & {
  role?: UserOrganizationRole;
};

export class CreateUserDto implements CreateUser {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Sanitize()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Sanitize()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Sanitize()
  lastName: string;

  @IsOptional()
  @IsEnum(UserOrganizationRole)
  role?: UserOrganizationRole;
}
