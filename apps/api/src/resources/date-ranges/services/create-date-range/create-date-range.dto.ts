// apps/api/src/resources/date-ranges/services/create-date-range/create-date-range.dto.ts
import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { IDateRange } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------

type CreateDateRange = Pick<IDateRange, 'name' | 'startDate' | 'endDate'>;

export class CreateDateRangeDto implements CreateDateRange {
  @IsString()
  @IsNotEmpty()
  @Sanitize()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  @Sanitize()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  @Sanitize()
  endDate: string;
}
