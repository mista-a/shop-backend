import { ProductEntity } from 'src/product/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('cartItem')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeId: number;

  @Column()
  count: number;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;
}
