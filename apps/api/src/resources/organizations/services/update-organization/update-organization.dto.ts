// apps/api/src/resources/organizations/services/update-organization/update-organization.dto.ts
import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { IOrganization, Currency } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

type UpdateOrganization = Partial<
  Pick<IOrganization, 'name' | 'logoUrl' | 'mainCurrency'>
> & {
  id?: number;
};

export class UpdateOrganizationDto implements UpdateOrganization {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  name?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @Sanitize()
  logoUrl?: string;

  @IsEnum(Currency)
  @IsOptional()
  mainCurrency?: Currency;
}
