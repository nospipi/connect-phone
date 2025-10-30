// apps/api/src/resources/media/services/create-media/create-media.dto.ts
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { IMedia } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { Transform } from 'class-transformer';

//----------------------------------------------------------------------

type CreateMedia = Pick<IMedia, 'description'>;

export class CreateMediaDto implements CreateMedia {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Sanitize()
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : null
  )
  description: string | null;
}
