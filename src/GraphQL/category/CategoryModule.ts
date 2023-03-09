import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity, ProductEntity } from '@root/database/entities';
import { CategoryResolver } from './CategoryResolver';
import { CategoryService } from './CategoryService';
import { CategoryRepository } from './CategoryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  providers: [CategoryResolver, CategoryService, CategoryRepository],
})
export class CategoryModule {}
