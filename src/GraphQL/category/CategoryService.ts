import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CategoryEntity, ProductEntity } from '@root/database/entities';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';
import { AsyncTimer } from '@root/shared/decorators/AsyncTimer';
import { CategoryRepository } from './CategoryRepository';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private customCategoryRepository: CategoryRepository,
  ) {}

  @AsyncTimer()
  async getCategories({ page, limit, orderBy, conditions, selections }) {
    const selectOptions: SelectOptions = {
      selections,
      rootAlias: 'categories',
      page,
      limit,
      conditions,
      orderBy,
    };
    //* Подумать над тем, как можно получать все категории для breadcrumbs

    const [categories, total] = await this.customCategoryRepository.deepSelect(
      selectOptions,
    );

    return { categories, total };
  }

  async updateCategory(id: number, productIds: any[]) {
    //string[]
    const products = await this.productRepository.find({ id: In(productIds) });

    const updatedCategory = await this.categoryRepository.save({
      id,
      products: products,
    });

    console.log('updatedCategory', updatedCategory);

    return true;
  }

  async addCategory(category: { name: string; level?: number }) {
    const { name, level } = category;

    return this.categoryRepository.save({
      name,
      level,
    });
  }

  async addSubCategory(
    parentId: number,
    category: { name: string; level?: number },
  ) {
    const parent = await this.categoryRepository.findOne(parentId, {
      relations: ['parents', 'sub_categories'],
    });

    const subCategoryParents = [...parent.parents?.map((p) => p.id), parentId];

    const subCategory = await this.categoryRepository.save({
      name: category.name,
      level: parent.level + 1,
      parents: await this.categoryRepository.find({
        id: In(subCategoryParents),
      }),
      parent_id: parentId,
    });

    parent.sub_categories.push(subCategory);
    await this.categoryRepository.save(parent);

    return subCategory;
  }

  async deleteCategories(ids: number[]) {
    return this.categoryRepository.delete(ids);
  }

  async categoryProductsCount(categoryId: number) {
    const category = await this.categoryRepository.findOne(categoryId, {
      relations: ['products'],
    });

    if (category.products.length) {
      return `Quantity: ${category.products.length}`;
    }

    return 'Empty';
  }
}
