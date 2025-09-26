// apps/api/src/resources/sales-channels/services/update-channel/update-sales-channel.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ISalesChannel } from '@connect-phone/shared-types';

type UpdateSalesChannel = Omit<
  ISalesChannel,
  | 'id'
  | 'organizationId'
  | 'organization'
  | 'logoUrl'
  | 'description'
  | 'isActive'
> & {
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
