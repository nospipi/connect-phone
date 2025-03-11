import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  id: number;

  @IsOptional()
  @Type(() => Date) // Transform the incoming string to a Date object
  createdAt = new Date();

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class BlankUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
