//packages/shared-types/src/product.ts

export interface Product {
  id: number;
  uuid: string;
  title: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  dataAmountInGb: number;
  validationDate: string; // ISO Date
  expirationDate: string;
}
