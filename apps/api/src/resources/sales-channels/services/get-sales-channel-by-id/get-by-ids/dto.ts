// apps/api/src/resources/sales-channels/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetSalesChannelsByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
