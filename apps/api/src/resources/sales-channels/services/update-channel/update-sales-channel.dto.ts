import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';

type UpdateSalesChannel = Omit<
  ISalesChannel,
  'id' | 'organizationId' | 'organization' | 'logoUrl' | 'description'
> & {
  description?: string;
  logoUrl?: string;
};

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
