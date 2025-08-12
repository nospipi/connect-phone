import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { SalesChannel as ISalesChannel } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/guards/decorators/sanitize.decorator';
//----------------------------------------------------------------------------

type CreateSalesChannel = Omit<ISalesChannel, 'id'>;
export class CreateSalesChannelDto implements CreateSalesChannel {
  @IsString()
  @IsNotEmpty()
  //@Sanitize()
  name: string;

  @IsNotEmpty()
  organizationId: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @Sanitize()
  logoUrl?: string;
}
