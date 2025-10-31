// apps/api/src/resources/cms/prices/services/update-price/update-price.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateIf,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IPrice, Currency } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { IsNonOverlappingDateRanges } from '@/database/validators/is-non-overlapping-date-ranges.validator';

//----------------------------------------------------------------------

type UpdatePrice = Partial<
  Pick<IPrice, 'name' | 'amount' | 'currency' | 'isDateBased'>
> & {
  id?: number;
  dateRangeIds?: number[];
  salesChannelIds?: number[];
};

export class UpdatePriceDto implements UpdatePrice {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  amount?: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsBoolean()
  @IsOptional()
  isDateBased?: boolean;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, { message: 'At least one sales channel is required' })
  @IsInt({ each: true })
  @Type(() => Number)
  salesChannelIds?: number[];

  @ValidateIf((o) => o.isDateBased === true)
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'At least one date range is required when isDateBased is true',
  })
  @IsInt({ each: true })
  @IsNonOverlappingDateRanges()
  @Type(() => Number)
  dateRangeIds?: number[];
}
