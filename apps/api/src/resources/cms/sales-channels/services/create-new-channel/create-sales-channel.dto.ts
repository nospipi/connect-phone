// apps/api/src/resources/cms/sales-channels/services/create-new-channel/create-sales-channel.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------------

type CreateSalesChannel = Omit<
  ISalesChannel,
  | 'id'
  | 'organizationId'
  | 'organization'
  | 'logo'
  | 'logoId'
  | 'description'
  | 'isActive'
> & {
  description?: string;
  logoId?: number | null;
  isActive?: boolean;
};

export class CreateSalesChannelDto implements CreateSalesChannel {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  name: string;

  @IsString()
  @IsOptional()
  @Sanitize()
  description?: string;

  @IsNumber()
  @IsOptional()
  logoId?: number | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
