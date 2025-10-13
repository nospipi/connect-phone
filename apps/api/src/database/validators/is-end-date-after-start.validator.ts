// apps/api/src/common/validators/is-end-date-after-start.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter, parseISO, isEqual } from 'date-fns';

//----------------------------------------------------------------------

@ValidatorConstraint({ name: 'isEndDateAfterStart', async: false })
export class IsEndDateAfterStartConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: string, args: ValidationArguments): boolean {
    const object = args.object as any;
    const startDateField = args.constraints[0];
    const startDate = object[startDateField];

    if (!startDate || !endDate) {
      return true;
    }

    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return isAfter(end, start) || isEqual(end, start);
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `endDate must be equal to or after ${args.constraints[0]}`;
  }
}

export function IsEndDateAfterStart(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEndDateAfterStartConstraint,
    });
  };
}
