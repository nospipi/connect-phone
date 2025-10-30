// apps/api/src/resources/countries/services/update-country/update-country.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ICountry } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//-----------------------------------------------------------------------------

type UpdateCountry = Partial<
  Pick<ICountry, 'flagAvatarUrl' | 'flagProductImageUrl'>
> & { id?: number };

export class UpdateCountryDto implements UpdateCountry {
  @IsOptional()
  id?: number;

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
}
