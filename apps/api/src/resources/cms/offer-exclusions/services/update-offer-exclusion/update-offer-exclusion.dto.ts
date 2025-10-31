// apps/api/src/resources/cms/offer-exclusions/services/update-offer-exclusion/update-offer-exclusion.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

type UpdateOfferExclusion = Partial<Pick<IOfferExclusion, 'body'>> & {
  id?: number;
};

export class UpdateOfferExclusionDto implements UpdateOfferExclusion {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  body?: string;
}
