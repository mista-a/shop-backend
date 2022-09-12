import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProductSortEnum, SearchProductDto } from './dto/search-product.dto';
import { CategoryEntity } from './entities/category.entity';
import { SubcategoryEntity } from './entities/subсategory.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PaginationDto } from './dto/pagination.dto';
import { UtilsService } from 'src/utils/UtilsService';
import { FilteredProduct } from './types/FilteredProduct';
import { ProductColor } from './types/ProductColor';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private product: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private category: Repository<CategoryEntity>,
    @InjectRepository(SubcategoryEntity)
    private subcategory: Repository<SubcategoryEntity>,
    @InjectRepository(UserEntity)
    private user: Repository<UserEntity>,
  ) {}

  async checkInFavorite(
    id: number,
    products: ProductEntity[],
  ): Promise<FilteredProduct[] | ProductEntity[]> {
    if (id && products.length) {
      const user = await this.user.findOne({
        where: { id },
        relations: ['favorites'],
      });

      return products.map((product) => {
        for (const favoriteProduct of user.favorites) {
          if (favoriteProduct.id === product.id) {
            return { ...product, inFavorite: true };
          }
        }
        return { ...product, inFavorite: false };
      });
    }
    return products;
  }

  async filterProducts(
    query: SearchProductDto & PaginationDto,
    qb?: SelectQueryBuilder<ProductEntity>,
  ) {
    const page: number = +query.page || 1;
    const limit: number = +query.limit || 12;
    const sort = query.sort || ProductSortEnum.toLessPopular;
    const min: number = +query.min || 0;
    const max: number = +query.max || 1500;

    qb = qb || this.product.createQueryBuilder('products');

    switch (sort) {
      case ProductSortEnum.toLessPopular:
        qb.orderBy('views', 'DESC');
        break;
      case ProductSortEnum.toMostPopular:
        qb.orderBy('views', 'ASC');
        break;
      case ProductSortEnum.toLessExpensive:
        qb.orderBy('price', 'DESC');
        break;
      case ProductSortEnum.toMostExpensive:
        qb.orderBy('price', 'ASC');
        break;
    }

    if (query.name) {
      qb.andWhere(`name ILIKE :name`, { name: `%${query.name}%` });
    }

    if (query.min || query.max) {
      qb.andWhere(`price BETWEEN :min AND :max`, { min, max });
    }

    if (query.colors) {
      let colorQuery: string = '(';
      if (Array.isArray(query.colors)) {
        query.colors.forEach((color, index) => {
          colorQuery += `products.colors @> '[{"name": "${color}"}]'${
            index !== query.colors.length - 1 ? ' OR ' : ')'
          }`;
        });
      } else {
        colorQuery = `products.colors @> '[{"name": "${query.colors}"}]'`;
      }

      qb.andWhere(colorQuery);
    }

    const totalProducts = (await qb.getManyAndCount())[1];
    const totalPages = Math.ceil(totalProducts / limit);

    console.log(page, 'page');
    console.log(limit, 'limit');

    qb.limit(limit).offset((page - 1) * limit);

    const filteredProducts = await qb.getMany();

    return { filteredProducts, totalProducts, totalPages };
  }

  create(dto: CreateProductDto) {
    return this.product.save({
      name: dto.name,
      price: dto.price,
      img: dto.img,
      showcase: dto.showcase,
      colors: dto.colors,
      category: { name: dto.category },
    });
  }

  async findProducts(userId: number, query: SearchProductDto & PaginationDto) {
    let { filteredProducts, totalPages, totalProducts } =
      await this.filterProducts(query);
    filteredProducts = await this.checkInFavorite(userId, filteredProducts);

    return {
      products: filteredProducts,
      page: +query.page || 1,
      totalPages,
      totalProducts,
    };
  }

  async findBySubcategory(
    userId: number,
    query: SearchProductDto & PaginationDto,
    categoryName?: string,
    subcategoryName?: string,
  ) {
    categoryName = UtilsService.urlToTitleCase(categoryName);
    subcategoryName = UtilsService.urlToTitleCase(subcategoryName);

    const category = await this.category.findOneBy({ name: categoryName });
    const subcategory = await this.subcategory.findOneBy({
      name: subcategoryName,
    });

    const qb = this.product.createQueryBuilder('products');

    qb.where({ category, subcategory });

    const products = await qb.getMany();

    const productColors: ProductColor[] = [];
    const unUniqueProductColors: string[] = [];
    products.forEach((product) => {
      product.colors.forEach(({ name, rgb }) => {
        if (!unUniqueProductColors.includes(name)) {
          unUniqueProductColors.push(name);
          productColors.push({ name, rgb });
        }
      });
    });

    let { filteredProducts, totalProducts, totalPages } =
      await this.filterProducts(query, qb);
    filteredProducts = await this.checkInFavorite(userId, filteredProducts);

    return {
      products: filteredProducts,
      page: +query.page || 1,
      productColors,
      totalProducts,
      totalPages,
    };
  }

  async findAllCategories() {
    return this.category.find({ relations: ['subcategories'] });
  }

  findByCategory(name: string) {
    name = name.substring(1, 1) + name[0].toUpperCase() + name.substring(1);

    return this.category.find({
      where: {
        name,
      },
      relations: ['products'],
    });
  }

  findSubcategories(name: string) {
    name = name.substring(1, 1) + name[0].toUpperCase() + name.substring(1);
    return this.category.find({
      where: {
        name,
      },
      relations: ['subcategories'],
    });
  }

  async popular(userId?: number) {
    const qb = this.product.createQueryBuilder();

    qb.orderBy('views', 'DESC');
    qb.limit(12);

    let [products, total] = await qb.getManyAndCount();

    products = await this.checkInFavorite(userId, products);

    return {
      products,
      total,
    };
  }

  async search(query: SearchProductDto & PaginationDto) {
    const qb = this.product.createQueryBuilder('products');

    const { filteredProducts, totalPages, totalProducts } =
      await this.filterProducts(query, qb);

    return {
      filteredProducts,
      totalPages,
      totalProducts,
    };
  }

  async findOne(userId: number, productId: number) {
    let product = await this.product.findOneBy({ id: productId });

    if (userId) {
      const user = await this.user.findOne({
        where: { id: userId },
        relations: ['cartItems', 'cartItems.product'],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      product.views += 1;
      await this.product.save(product);

      const filteredProduct: any = product;
      for (let productItem of user.cartItems) {
        if (productItem.product.id === productId) {
          filteredProduct.inCart = true;
        }
      }

      return filteredProduct;
    }

    return product;
  }

  async remove(id: number) {
    const find = await this.product.findOneBy({ id: +id });

    if (!find) {
      throw new NotFoundException('Product not found');
    }

    return this.product.delete(id);
  }
}
