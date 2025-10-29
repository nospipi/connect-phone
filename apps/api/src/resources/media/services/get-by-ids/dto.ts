// apps/api/src/resources/media/services/get-by-ids/dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

//------------------------------------------------------------

export class GetMediaByIdsQueryDto {
  @IsString()
  @IsNotEmpty()
  ids: string;
}
