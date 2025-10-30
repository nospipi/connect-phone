// apps/api/src/resources/date-ranges/services/update-date-range/update-date-range.dto.ts
import { IsString, IsOptional, Matches } from 'class-validator';
import { IDateRange } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
import { IsEndDateAfterStart } from '@/database/validators/is-end-date-after-start.validator';

//----------------------------------------------------------------------

type UpdateDateRange = Partial<
  Pick<IDateRange, 'name' | 'startDate' | 'endDate'>
> & {
  id?: number;
};

export class UpdateDateRangeDto implements UpdateDateRange {
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @Sanitize()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  @Sanitize()
  startDate?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  @IsEndDateAfterStart('startDate', {
    message: 'endDate must be equal to or after startDate',
  })
  @Sanitize()
  endDate?: string;
}
