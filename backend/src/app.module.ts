import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, jwtConfig } from './config/index';

// Entities
import { Role } from './modules/roles/entities/role.entity';
import { User } from './modules/users/entities/user.entity';
import { Token } from './modules/auth/entities/token.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Product, ProductImage } from './modules/products/entities/index';
import { Cart, CartItem } from './modules/cart/entities/index';
import { Address } from './modules/addresses/entities/address.entity';
import { Order, OrderItem } from './modules/orders/entities/index';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AddressesModule } from './modules/addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          Role,
          User,
          Token,
          Category,
          Product,
          ProductImage,
          Cart,
          CartItem,
          Address,
          Order,
          OrderItem,
        ],
        synchronize: false, // Use migrations instead
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    AddressesModule,
  ],
})
export class AppModule {}
