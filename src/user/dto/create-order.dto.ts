import { IsEmail, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  firstName: string;
  lastName: string;

  @IsEmail(undefined, { message: 'Wrong email' })
  email: string;

  // @IsPhoneNumber(undefined, { message: 'Wrong email' })
  phoneNumber: string;

  firstNameRecipient: string;
  lastNameRecipient: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  state?: string;

  @IsNumber()
  zip: number;

  shippingMethod: string;

  paymentMethod: string;

  paymentFields: object;
}
