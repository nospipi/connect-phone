// apps/api/src/resources/countries/services/update-country/update-country.dto.ts
import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { ICountry, CountryRegion } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

type UpdateCountry = Partial<
  Pick<ICountry, 'name' | 'flagAvatarUrl' | 'flagProductImageUrl' | 'region'>
> & { id?: number };

export class UpdateCountryDto implements UpdateCountry {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  name?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @Sanitize()
  flagAvatarUrl?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @Sanitize()
  flagProductImageUrl?: string;

  @IsEnum(CountryRegion)
  @IsOptional()
  region?: CountryRegion;
}
