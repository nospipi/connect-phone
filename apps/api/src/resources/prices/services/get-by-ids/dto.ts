// apps/api/src/resources/prices/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetPricesByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
