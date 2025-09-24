// apps/api/src/resources/users/services/update-user/update-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { UserOrganizationRole } from '@connect-phone/shared-types';

//----------------------------------------------------------------------------

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Sanitize()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Sanitize()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @Sanitize()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value
  )
  email?: string;

  @IsOptional()
  @IsEnum(UserOrganizationRole)
  role?: UserOrganizationRole;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;
}
