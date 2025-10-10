// apps/api/src/database/seeding/factories/price.factory.ts

import { Currency } from '@connect-phone/shared-types';

export function generatePrices(): Partial<{
  amount: number;
  currency: Currency;
  isDateBased: boolean;
}>[] {
  return [
    { amount: 10.0, currency: Currency.USD, isDateBased: true },
    { amount: 25.0, currency: Currency.USD, isDateBased: true },
    { amount: 50.0, currency: Currency.USD, isDateBased: false },
    { amount: 9.5, currency: Currency.EUR, isDateBased: true },
    { amount: 23.5, currency: Currency.EUR, isDateBased: true },
    { amount: 47.0, currency: Currency.EUR, isDateBased: false },
  ];
}
