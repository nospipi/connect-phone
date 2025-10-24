// apps/api/src/resources/countries/services/get-all-countries-of-org/search-countries.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { CountryRegion } from '@connect-phone/shared-types';

//------------------------------------------------------

export class SearchCountriesDto {
  @IsOptional()
  @IsString()
  @Sanitize()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  search?: string = '';

  @IsOptional()
  @IsString()
  @IsIn([
    'all',
    ...Object.values(CountryRegion),
    ...Object.values(CountryRegion).map((region) => region.toLowerCase()),
  ])
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : 'all'
  )
  region?: string = 'all';
}
