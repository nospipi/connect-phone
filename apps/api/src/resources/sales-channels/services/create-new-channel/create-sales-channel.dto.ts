// apps/api/src/resources/sales-channels/services/create-new-channel/create-sales-channel.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { ISalesChannel as ISalesChannel } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
//----------------------------------------------------------------------------

// Remove both 'id' and 'organizationId' since they're handled automatically
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
  //@Sanitize() // Don't sanitize URLs as it might break them
  logoUrl?: string;
}
