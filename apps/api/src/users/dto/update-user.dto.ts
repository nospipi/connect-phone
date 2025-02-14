import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
