import { ProductEntity } from '../entities/product.entity';

export type FilteredProduct = {
  inFavorite: boolean;
} & ProductEntity;
