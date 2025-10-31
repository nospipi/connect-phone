// apps/api/src/resources/cms/sales-channels/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetSalesChannelsByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
