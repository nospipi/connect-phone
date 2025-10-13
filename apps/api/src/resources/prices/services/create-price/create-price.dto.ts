// apps/api/src/resources/prices/services/create-price/create-price.dto.ts
import {
  IsString,
  IsNotEmpty,
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

type CreatePrice = Pick<
  IPrice,
  'name' | 'amount' | 'currency' | 'isDateBased'
> & {
  dateRangeIds: number[];
  salesChannelIds: number[];
};

export class CreatePriceDto implements CreatePrice {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsBoolean()
  isDateBased: boolean;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one sales channel is required' })
  @IsInt({ each: true })
  @Type(() => Number)
  salesChannelIds: number[];

  @ValidateIf((o) => o.isDateBased === true)
  @IsArray()
  @ArrayMinSize(1, {
    message: 'At least one date range is required when isDateBased is true',
  })
  @IsInt({ each: true })
  @IsNonOverlappingDateRanges()
  @Type(() => Number)
  dateRangeIds: number[];
}
