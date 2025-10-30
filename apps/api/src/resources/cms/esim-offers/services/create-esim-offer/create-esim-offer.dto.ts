// apps/api/src/resources/esim-offers/services/create-esim-offer/create-esim-offer.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { IEsimOffer } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { Type } from 'class-transformer';
import { IsDataRequiredIfNotUnlimited } from '@/common/validators/is-data-required-if-not-unlimited.validator';

//----------------------------------------------------------------------

type CreateEsimOffer = Pick<
  IEsimOffer,
  | 'title'
  | 'descriptionHtml'
  | 'descriptionText'
  | 'durationInDays'
  | 'dataInGb'
  | 'isUnlimitedData'
> & {
  isActive?: boolean;
  inclusionIds?: number[];
  exclusionIds?: number[];
  mainImageId?: number | null;
  imageIds?: number[];
  countryIds?: number[];
  salesChannelIds?: number[];
  priceIds?: number[];
};

export class CreateEsimOfferDto implements CreateEsimOffer {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  title: string;

  @IsString()
  @IsNotEmpty()
  //@Sanitize()
  descriptionHtml: string;

  @IsString()
  @IsNotEmpty()
  @Sanitize()
  descriptionText: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  durationInDays: number;

  @ValidateIf((o) => o.isUnlimitedData !== true)
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsDataRequiredIfNotUnlimited()
  dataInGb: number | null;

  @IsBoolean()
  @Type(() => Boolean)
  isUnlimitedData: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  inclusionIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  exclusionIds?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mainImageId?: number | null;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  imageIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  countryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  salesChannelIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  priceIds?: number[];
}
