// apps/api/src/resources/sales-channels/services/find-all-by-org-paginated/search-sales-channels.dto.ts
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

export class SearchSalesChannelsDto {
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
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : ''
  )
  search?: string = '';
}
