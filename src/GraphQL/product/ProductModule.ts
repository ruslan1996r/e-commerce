import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from './ProductResolver';
import { ProductService } from './ProductService';
import { CustomJwtModule } from '@root/auth/jwt/JwtModule';
import { ProductRepository } from './ProductRepository';
import {
  CategoryEntity,
  UserEntity,
  ProductEntity,
} from '@root/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, CategoryEntity]),
    CustomJwtModule,
  ],
  providers: [ProductResolver, ProductService, ProductRepository],
})
export class ProductModule {}
