import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  firstNameRecipient: string;

  @Column()
  lastNameRecipient: string;

  @Column()
  company: string;

  @Column()
  address: string;

  @Column()
  apartment: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  zip: number;

  @Column()
  shippingMethod: string;

  paymentMethod: string;

  paymentFields: object;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
