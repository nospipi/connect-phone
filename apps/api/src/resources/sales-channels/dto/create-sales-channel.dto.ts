import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { SalesChannel as ISalesChannel } from '@connect-phone/shared-types';
//----------------------------------------------------------------------------

type CreateSalesChannel = Omit<ISalesChannel, 'id'>;
export class CreateSalesChannelDto implements CreateSalesChannel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  organizationId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
