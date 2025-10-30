// apps/api/src/resources/offer-inclusions/services/update-offer-inclusion/update-offer-inclusion.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

type UpdateOfferInclusion = Partial<Pick<IOfferInclusion, 'body'>> & {
  id?: number;
};

export class UpdateOfferInclusionDto implements UpdateOfferInclusion {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  body?: string;
}
