import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsUrl,
} from 'class-validator';
//import { Type } from 'class-transformer';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  slug: string;
}

export class AddUrlDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  logoUrl: string;
}
