import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSalesChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  organizationUuid: string; // Using UUID instead of ID for API
}
