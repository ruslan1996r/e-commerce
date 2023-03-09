import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';
import { AsyncTimer } from '@root/shared/decorators/AsyncTimer';
import { ProductRepository } from './ProductRepository';
import { ProductInput } from './ProductTypes';
import { CategoryEntity, ProductEntity } from '@root/database/entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private customProductRepository: ProductRepository,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  @AsyncTimer()
  async allProducts({ page, selections, limit, orderBy, conditions }) {
    const selectOptions: SelectOptions = {
      selections,
      rootAlias: 'products',
      page,
      limit,
      orderBy,
      conditions,
    };

    const [products, total] = await this.customProductRepository.deepSelect(
      selectOptions,
    );

    return {
      total,
      products,
    };
  }

  async getProduct(id: string) {
    return this.productRepository.findOne(id);
  }

  async createProduct(input: ProductInput) {
    const category = await this.categoryRepository.findOne({
      id: input.category_id,
    });

    const body = {
      ...input,
      category,
    };

    return this.productRepository.save(body);
  }

  async deleteProduct(ids: string[]) {
    return this.productRepository.delete(ids);
  }
}
