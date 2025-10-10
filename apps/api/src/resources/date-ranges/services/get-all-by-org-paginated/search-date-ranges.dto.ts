// apps/api/src/resources/date-ranges/services/get-all-by-org-paginated/search-date-ranges.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

export class SearchDateRangesDto {
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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  @Sanitize()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  date?: string = '';
}
