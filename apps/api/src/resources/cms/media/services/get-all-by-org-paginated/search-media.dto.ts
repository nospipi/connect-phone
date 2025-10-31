// apps/api/src/resources/cms/media/services/get-all-by-org-paginated/search-media.dto.ts
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

export class SearchMediaDto {
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
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @Sanitize()
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : ''
  )
  search?: string = '';
}
