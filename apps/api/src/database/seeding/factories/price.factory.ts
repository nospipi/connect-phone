// apps/api/src/database/seeding/factories/price.factory.ts

import { Currency } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

export function generatePrices(): Partial<{
  name: string;
  amount: number;
  currency: Currency;
  isDateBased: boolean;
}>[] {
  return [
    {
      name: 'Low Season Price',
      amount: 10.0,
      currency: Currency.USD,
      isDateBased: true,
    },
    {
      name: 'Mid Season Price',
      amount: 25.0,
      currency: Currency.USD,
      isDateBased: true,
    },
    {
      name: 'High Season Price',
      amount: 50.0,
      currency: Currency.USD,
      isDateBased: false,
    },
    {
      name: 'Low Season Price (EUR)',
      amount: 9.5,
      currency: Currency.EUR,
      isDateBased: true,
    },
    {
      name: 'Mid Season Price (EUR)',
      amount: 23.5,
      currency: Currency.EUR,
      isDateBased: true,
    },
    {
      name: 'High Season Price (EUR)',
      amount: 47.0,
      currency: Currency.EUR,
      isDateBased: false,
    },
  ];
}
