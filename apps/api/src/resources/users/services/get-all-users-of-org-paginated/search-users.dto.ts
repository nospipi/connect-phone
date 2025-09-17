// apps/api/src/resources/users/services/get-all-users-of-org-paginated/search-users.dto.ts
import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { UserOrganizationRole } from '../../../../database/entities/user-organization.entity';

//----------------------------------------------------------------------------

export class SearchUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Sanitize()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  search?: string = '';

  @IsOptional()
  @IsString()
  @IsIn([
    'all',
    ...Object.values(UserOrganizationRole),
    ...Object.values(UserOrganizationRole).map((role) => role.toLowerCase()),
  ])
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : 'all'
  )
  role?: string = 'all';
}
