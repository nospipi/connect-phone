// apps/api/src/resources/prices/services/get-all-by-org-paginated/search-prices.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { Currency } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

export class SearchPricesDto {
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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Currency, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  currencies?: Currency[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    return value;
  })
  dateRangeIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    return value;
  })
  salesChannelIds?: number[];
}
