// apps/api/src/resources/esim-offers/services/update-esim-offer/update-esim-offer.dto.ts

import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { IEsimOffer } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { Type } from 'class-transformer';

//----------------------------------------------------------------------

type UpdateEsimOffer = Partial<
  Pick<
    IEsimOffer,
    | 'title'
    | 'descriptionHtml'
    | 'descriptionText'
    | 'durationInDays'
    | 'dataInGb'
    | 'isUnlimitedData'
    | 'isActive'
  >
> & {
  id?: number;
  inclusionIds?: number[];
  exclusionIds?: number[];
  mainImageId?: number | null;
  imageIds?: number[];
  countryIds?: number[];
  salesChannelIds?: number[];
  priceIds?: number[];
};

export class UpdateEsimOfferDto implements UpdateEsimOffer {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  title?: string;

  @IsString()
  @IsOptional()
  //@Sanitize()
  descriptionHtml?: string;

  @IsString()
  @IsOptional()
  @Sanitize()
  descriptionText?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  durationInDays?: number;

  @IsOptional()
  @ValidateIf((o) => o.isUnlimitedData !== true)
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dataInGb?: number | null;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isUnlimitedData?: boolean;

  @IsBoolean()
  @IsOptional()
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
