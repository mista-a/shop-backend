import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartItemEntity } from './entities/cartItem.entity';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private product: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity)
    private cartItem: Repository<CartItemEntity>,
    @InjectRepository(OrderEntity)
    private order: Repository<OrderEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    return this.repository.save({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async toggleFavorite(id: number, productId: number) {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['favorites'],
    });

    let inFavorite = false;
    const qb = this.repository.createQueryBuilder();

    for (let product of user.favorites) {
      if (product.id === productId) {
        inFavorite = true;
        await qb.relation(UserEntity, 'favorites').of(id).remove(productId);
        return;
      }
    }

    if (!inFavorite) {
      await qb.relation(UserEntity, 'favorites').of(id).add(productId);
    }
  }

  async getFavorites(id: number) {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['favorites'],
    });

    const filteredProducts: any = user.favorites;
    filteredProducts.map((product) => {
      product.inFavorite = true;
    });

    return filteredProducts;
  }

  async getCart(userId: number) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['cartItems', 'cartItems.product'],
    });
    return user.cartItems;
  }

  async addToCart(
    userId: number,
    typeId: number,
    count: number,
    productId: number,
  ) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    const product = await this.product.findOneBy({
      id: productId,
    });

    for (let cartItem of user.cartItems) {
      if (cartItem.product.id === productId) {
        throw new ConflictException('Product already in cart');
      }
    }

    const cartItem = await this.cartItem.save({ count, typeId, product });
    user.cartItems.push(cartItem);

    user.cartPrice += product.price * count;
    user.cartCount += count;

    return this.repository.save(user);
  }

  async deleteFromCart(userId: number, cartItemId: number) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user.cartItems.map((cartItem, index) => {
      if (cartItem.id === cartItemId) {
        user.cartPrice -= cartItem.product.price * cartItem.count;
        user.cartCount -= cartItem.count;
        user.cartItems.splice(index, 1);
        this.repository.save(user);
      }
    });
  }

  findByCond(cond) {
    return this.repository.findOne({ where: cond });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async createOrder(id: number, dto: CreateOrderDto) {
    const user = await this.repository.findOneBy({ id });
    if (user) {
      this.order.save({ user, ...dto });
      user.cartItems = [];
      user.cartPrice = 0;
      user.cartCount = 0;
      this.repository.save(user);
    }
  }

  async getLastOrderData(id: number) {
    const orders = await this.order.find({
      relations: ['user'],
      where: {
        user: {
          id,
        },
      },
    });
    return orders[orders.length - 1];
  }
}
