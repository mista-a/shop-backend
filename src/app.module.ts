import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { CategoryEntity } from './product/entities/category.entity';
import { SubcategoryEntity } from './product/entities/subсategory.entity';
import { CartItemEntity } from './user/entities/cartItem.entity';
import { OrderEntity } from './user/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:ppassword@localhost:5432/shop',
      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: 'ppassword',
      // database: 'shop',
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        UserEntity,
        ProductEntity,
        CategoryEntity,
        SubcategoryEntity,
        CartItemEntity,
        OrderEntity,
      ],
    }),
    UserModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
