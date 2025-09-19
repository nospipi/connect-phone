// apps/api/src/resources/sales-channels/services/create-new-channel/create-sales-channel.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
//----------------------------------------------------------------------------
type CreateSalesChannel = Omit<
  ISalesChannel,
  'id' | 'organizationId' | 'organization' | 'logoUrl' | 'description'
> & {
  description?: string;
  logoUrl?: string;
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

  @IsString()
  @IsOptional()
  @IsUrl()
  @Sanitize()
  logoUrl?: string;
}
