import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  id: number;

  @IsOptional()
  createdAt = new Date();

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
