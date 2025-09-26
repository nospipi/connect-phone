// apps/api/src/resources/sales-channels/services/update-sales-channel/update-sales-channel.dto.ts
import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';

type UpdateSalesChannel = Omit<
  ISalesChannel,
  | 'id'
  | 'name'
  | 'organizationId'
  | 'organization'
  | 'logoUrl'
  | 'description'
  | 'isActive'
> & {
  id?: number;
  name?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
};

export class UpdateSalesChannelDto implements UpdateSalesChannel {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
