// apps/api/src/common/validators/is-data-required-if-not-unlimited.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

//----------------------------------------------------------------------

@ValidatorConstraint({ name: 'isDataRequiredIfNotUnlimited', async: false })
export class IsDataRequiredIfNotUnlimitedConstraint
  implements ValidatorConstraintInterface
{
  validate(dataInGb: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const isUnlimitedData = object.isUnlimitedData;

    if (isUnlimitedData === true) {
      return true;
    }

    return dataInGb !== null && dataInGb !== undefined && dataInGb >= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'dataInGb is required when isUnlimitedData is false';
  }
}

export function IsDataRequiredIfNotUnlimited(
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDataRequiredIfNotUnlimitedConstraint,
    });
  };
}
