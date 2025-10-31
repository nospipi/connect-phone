// apps/api/src/resources/cms/date-ranges/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetDateRangesByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
