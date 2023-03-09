import {
  Args,
  // Field,
  // InputType,
  Int,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Root,
} from '@nestjs/graphql';
import { CategoryEntity } from '@root/database/entities';
import {
  GraphSelection,
  GraphSelections,
} from '@root/shared/decorators/GraphSelection';
import { CategoryService } from './CategoryService';
import {
  CategoryConditions,
  CategoryInput,
  CategoryOutput,
} from './CategoryTypes';

@Resolver(CategoryEntity)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @ResolveField(() => String)
  products_count(@Root() category: CategoryEntity) {
    return this.categoryService.categoryProductsCount(category.id);
  }

  @Query(() => CategoryOutput)
  async getCategories(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args({ name: 'orderBy', type: () => String, defaultValue: 'name' })
    orderBy: string,
    @Args({
      name: 'conditions',
      type: () => CategoryConditions,
      nullable: true,
    })
    conditions: CategoryConditions,
    @GraphSelection({ root: 'categories' }) selections: GraphSelections[],
  ) {
    const { categories, total } = await this.categoryService.getCategories({
      page,
      limit,
      orderBy,
      conditions,
      selections,
    });

    return { categories, total };
  }

  @Mutation(() => CategoryEntity)
  addCategory(
    @Args({ name: 'category', type: () => CategoryInput })
    category: CategoryInput,
  ) {
    return this.categoryService.addCategory(category);
  }

  // @Mutation(() => CategoryEntity)
  @Mutation(() => Boolean)
  updateCategory(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'productIds', type: () => [String] }) productIds: string[],
  ): Promise<boolean> {
    return this.categoryService.updateCategory(id, productIds);
  }

  @Mutation(() => CategoryEntity)
  addSubCategory(
    @Args({ name: 'parentId', type: () => Int }) parentId: number,
    @Args({ name: 'subCategory', type: () => CategoryInput })
    subCategory: CategoryInput,
  ) {
    return this.categoryService.addSubCategory(parentId, subCategory);
  }

  @Mutation(() => Boolean)
  async deleteCategories(
    @Args({ name: 'ids', type: () => [Int] }) ids: number[],
  ): Promise<boolean> {
    try {
      const res = await this.categoryService.deleteCategories(ids);
      console.log('deleteCategories: ', res);
      return true;
    } catch (error) {
      console.log('deleteCategories_error', error);
      return false;
    }
  }

  // @Query(() => [View])
  // getRecursive(
  //   @Args({ name: 'categoryId', type: () => Int }) categoryId: number,
  //   @Args({ name: 'lvl', type: () => Int }) lvl: number,
  // ) {
  //   return this.categoryService.getRecursive(categoryId, lvl);
  // }
}
