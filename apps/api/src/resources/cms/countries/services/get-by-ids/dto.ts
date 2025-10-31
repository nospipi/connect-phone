// apps/api/src/resources/cms/countries/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetCountriesByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
