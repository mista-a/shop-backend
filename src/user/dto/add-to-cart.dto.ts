import { IsEmail, IsNumber } from 'class-validator';
import { UniqueOnDatabase } from 'src/auth/validations/uniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class addToCartDto {
  @IsNumber()
  count: number;

  @IsNumber()
  typeId: number;

  @IsNumber()
  productId: number;
}
