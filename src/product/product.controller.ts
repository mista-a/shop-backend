import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProducts(
    @User() userId: number,
    @Query() query: PaginationDto & SearchProductDto,
  ) {
    return this.productService.findProducts(userId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() userId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('/categories')
  allCategories() {
    return this.productService.findAllCategories();
  }

  @Get('/category/:name')
  getByCategory(@Param('name') name: string) {
    return this.productService.findByCategory(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('product/:productId')
  findOne(@User() userId: number, @Param('productId') productId: string) {
    return this.productService.findOne(userId, +productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':category/:subcategory')
  getBySubcategory(
    @User() id: number,
    @Param('category') categoryName: string,
    @Param('subcategory') subcategoryName: string,
    @Query() query: PaginationDto & SearchProductDto,
  ) {
    return this.productService.findBySubcategory(
      id,
      query,
      categoryName,
      subcategoryName,
    );
  }
}
