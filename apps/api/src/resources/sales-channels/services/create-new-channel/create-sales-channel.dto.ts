import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { SalesChannel as ISalesChannel } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
//----------------------------------------------------------------------------

type CreateSalesChannel = Omit<ISalesChannel, 'id' | 'organizationId'>;
export class CreateSalesChannelDto implements CreateSalesChannel {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  name: string;

  @IsString()
  @IsOptional()
  @Sanitize()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  //@Sanitize()
  logoUrl?: string;
}
