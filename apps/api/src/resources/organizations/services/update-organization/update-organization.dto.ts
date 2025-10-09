// apps/api/src/resources/organizations/services/update-organization/update-organization.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';
import { IOrganization } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

type UpdateOrganization = Partial<Pick<IOrganization, 'name' | 'logoUrl'>> & {
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
}
