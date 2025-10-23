// apps/api/src/resources/esim-offers/services/get-all-by-org-paginated/search-esim-offers.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

export class SearchEsimOffersDto {
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
  @IsNumber()
  @Min(0)
  minDataInGb?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDataInGb?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUnlimitedData?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minDurationInDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxDurationInDays?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    return value;
  })
  countryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    return value;
  })
  salesChannelIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => parseInt(v.trim(), 10));
    }
    return value;
  })
  priceIds?: number[];
}
