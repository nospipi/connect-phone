// apps/api/src/resources/media/services/update-media/update-media.dto.ts
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { IMedia } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { Transform } from 'class-transformer';

//----------------------------------------------------------------------

type UpdateMedia = Partial<Pick<IMedia, 'description'>> & {
  id?: number;
};

export class UpdateMediaDto implements UpdateMedia {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Sanitize()
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : null
  )
  description?: string | null;
}
