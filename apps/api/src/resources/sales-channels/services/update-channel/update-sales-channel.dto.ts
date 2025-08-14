import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { ISalesChannel as ISalesChannel } from '@connect-phone/shared-types';

type UpdateSalesChannel = Omit<ISalesChannel, 'organizationId'>;

export class UpdateSalesChannelDto implements UpdateSalesChannel {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
