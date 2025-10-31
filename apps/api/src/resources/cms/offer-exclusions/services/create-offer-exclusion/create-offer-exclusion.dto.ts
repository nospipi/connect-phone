// apps/api/src/resources/cms/offer-exclusions/services/create-offer-exclusion/create-offer-exclusion.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { IOfferExclusion } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

type CreateOfferExclusion = Pick<IOfferExclusion, 'body'>;

export class CreateOfferExclusionDto implements CreateOfferExclusion {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  body: string;
}
