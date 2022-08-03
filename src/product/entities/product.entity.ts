import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductColor } from '../types/ProductColor';
import { CategoryEntity } from './category.entity';
import { SubcategoryEntity } from './subсategory.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  price: number;

  @Column('jsonb')
  colors: ProductColor[];

  //fix типизировать showcase
  @Column('jsonb')
  showcase: any;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity)
  subcategory: SubcategoryEntity;

  // @Column('text', { array: true, default: [] })
  // sizes: string[];

  // @Column()
  // description: string;
}
