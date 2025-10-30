// apps/api/src/resources/offer-inclusions/services/create-offer-inclusion/create-offer-inclusion.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { IOfferInclusion } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

type CreateOfferInclusion = Pick<IOfferInclusion, 'body'>;

export class CreateOfferInclusionDto implements CreateOfferInclusion {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  body: string;
}
