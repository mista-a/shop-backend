import { IsEmail } from 'class-validator';
import { UniqueOnDatabase } from 'src/auth/validations/uniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  name: string;

  @IsEmail(undefined, { message: 'Wrong email' })
  // @UniqueOnDatabase(UserEntity, {
  //   message: 'Email is already exist',
  // })
  email: string;

  password: string;
}
