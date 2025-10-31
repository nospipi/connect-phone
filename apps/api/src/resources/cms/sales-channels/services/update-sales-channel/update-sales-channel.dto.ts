// apps/api/src/resources/cms/sales-channels/services/update-sales-channel/update-sales-channel.dto.ts
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

type UpdateSalesChannel = Omit<
  ISalesChannel,
  | 'id'
  | 'name'
  | 'organizationId'
  | 'organization'
  | 'logo'
  | 'logoId'
  | 'description'
  | 'isActive'
> & {
  id?: number;
  name?: string;
  description?: string;
  logoId?: number | null;
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

  @IsNumber()
  @IsOptional()
  logoId?: number | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
