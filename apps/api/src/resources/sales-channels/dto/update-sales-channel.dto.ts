import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSalesChannelDto extends PartialType(CreateSalesChannelDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Note: organizationUuid typically shouldn't be updatable
  // Remove it from updates by omitting it here
}
