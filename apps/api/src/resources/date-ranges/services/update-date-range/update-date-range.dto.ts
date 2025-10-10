// apps/api/src/resources/date-ranges/services/update-date-range/update-date-range.dto.ts
import { IsString, IsOptional, Matches } from 'class-validator';
import { IDateRange } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

type UpdateDateRange = Partial<Pick<IDateRange, 'startDate' | 'endDate'>> & {
  id?: number;
};

export class UpdateDateRangeDto implements UpdateDateRange {
  @IsOptional()
  id?: number;

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
  @Sanitize()
  endDate?: string;
}
