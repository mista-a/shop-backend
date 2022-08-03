import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity('subcategory')
export class SubcategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.subcategory)
  products: ProductEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.subcategories)
  category: CategoryEntity;
}
