// apps/api/src/database/seeding/factories/date-range.factory.ts

export function generateDateRanges(): Partial<{
  name: string;
  startDate: string;
  endDate: string;
}>[] {
  return [
    { name: 'Q1 2025', startDate: '2025-01-01', endDate: '2025-03-31' },
    { name: 'Q2 2025', startDate: '2025-04-01', endDate: '2025-06-30' },
    { name: 'Q3 2025', startDate: '2025-07-01', endDate: '2025-09-30' },
    { name: 'Q4 2025', startDate: '2025-10-01', endDate: '2025-12-31' },
  ];
}
