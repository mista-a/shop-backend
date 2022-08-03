import { IsArray, IsNumber, IsString } from 'class-validator';

//fix showcase
// class showcaseItem {
//   miniImg: string
//   imgs: string[]
// }

export class CreateProductDto {
  @IsString()
  name: string;

  // @IsNumber()
  price: number;

  @IsString()
  img: string;

  @IsString()
  category: string;

  showcase: any;

  @IsArray()
  colors: { name: string; rgb: string }[];

  // sizes?: string[];
  // description?: string;
}
