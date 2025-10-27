// apps/api/src/database/validators/is-non-overlapping-date-ranges.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';

//----------------------------------------------------------------------

@ValidatorConstraint({ name: 'isNonOverlappingDateRanges', async: true })
@Injectable()
export class IsNonOverlappingDateRangesConstraint
  implements ValidatorConstraintInterface
{
  private readonly logger = new Logger(
    IsNonOverlappingDateRangesConstraint.name
  );

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async validate(
    dateRangeIds: number[],
    args: ValidationArguments
  ): Promise<boolean> {
    if (!dateRangeIds || !Array.isArray(dateRangeIds)) {
      return true;
    }

    if (dateRangeIds.length <= 1) {
      return true;
    }

    try {
      const dateRanges = await this.dataSource
        .getRepository(DateRangeEntity)
        .findByIds(dateRangeIds);

      if (dateRanges.length !== dateRangeIds.length) {
        return false;
      }

      for (let i = 0; i < dateRanges.length; i++) {
        for (let j = i + 1; j < dateRanges.length; j++) {
          const range1 = dateRanges[i];
          const range2 = dateRanges[j];

          if (this.dateRangesOverlap(range1, range2)) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error validating date ranges:', error);
      return false;
    }
  }

  private dateRangesOverlap(
    range1: DateRangeEntity,
    range2: DateRangeEntity
  ): boolean {
    const start1 = parseISO(range1.startDate);
    const end1 = parseISO(range1.endDate);
    const start2 = parseISO(range2.startDate);
    const end2 = parseISO(range2.endDate);

    const condition1 = isBefore(start1, end2) || isEqual(start1, end2);
    const condition2 = isAfter(end1, start2) || isEqual(end1, start2);

    return condition1 && condition2;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Date ranges must not overlap';
  }
}

export function IsNonOverlappingDateRanges(
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNonOverlappingDateRangesConstraint,
    });
  };
}
