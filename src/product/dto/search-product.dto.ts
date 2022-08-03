export enum ProductSortEnum {
  toLessPopular = 'toLessPopular',
  toMostPopular = 'toMostPopular',
  toLessExpensive = 'toLessExpensive',
  toMostExpensive = 'toMostExpensive',
}

export class SearchProductDto {
  name?: string;
  min?: number;
  max?: number;
  colors?: string[] | string;
  type?: string;
  limit?: number;
  page?: number;
  sort?: typeof ProductSortEnum;
}
