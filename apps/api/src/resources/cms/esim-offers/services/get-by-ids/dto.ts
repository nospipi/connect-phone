// apps/api/src/resources/cms/esim-offers/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetEsimOffersByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
