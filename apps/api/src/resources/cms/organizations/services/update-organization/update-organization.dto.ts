// apps/api/src/resources/cms/organizations/services/update-organization/update-organization.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { IOrganization, Currency } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { IsEnum } from 'class-validator';

//----------------------------------------------------------------------

type UpdateOrganization = Partial<
  Pick<IOrganization, 'name' | 'logoId' | 'mainCurrency'>
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

  @IsNumber()
  @IsOptional()
  logoId?: number | null;

  @IsEnum(Currency)
  @IsOptional()
  mainCurrency?: Currency;
}
