import { Logger, UseGuards } from '@nestjs/common';
import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql';

// import { AuthGuard } from '@root/guards/AuthGuard';
import { AdminGuard } from '@root/shared/guards/AdminGuard';
import { ProductEntity } from '@root/database/entities';
import { ProductService } from './ProductService';
import {
  ProductConditions,
  ProductInput,
  ProductsOutput,
} from './ProductTypes';
import {
  GraphSelection,
  GraphSelections,
} from '@root/shared/decorators/GraphSelection';

@Resolver(() => ProductEntity)
export class ProductResolver {
  private readonly logger: Logger = new Logger(ProductResolver.name);
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductsOutput)
  // @UseGuards(AuthGuard)
  async allProducts(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args({ name: 'orderBy', type: () => String, defaultValue: 'created_at' })
    orderBy: string,
    @Args({ name: 'conditions', type: () => ProductConditions, nullable: true })
    conditions: ProductConditions,
    @GraphSelection({ root: 'products' }) selections: GraphSelections[],
  ): Promise<ProductsOutput> {
    return this.productService.allProducts({
      page,
      selections,
      limit,
      orderBy,
      conditions,
    });
  }

  @Query(() => ProductEntity, { nullable: true })
  async getProduct(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<ProductEntity | undefined> {
    return this.productService.getProduct(id);
  }

  @Mutation(() => ProductEntity)
  async createProduct(
    @Args({ name: 'input', type: () => ProductInput }) input: ProductInput,
  ) {
    return this.productService.createProduct(input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ): Promise<boolean> {
    // Переписать логику. Здесь должен быть NotFound
    try {
      const res = await this.productService.deleteProduct(ids);
      console.log('res', res);
      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  @UseGuards(AdminGuard)
  @Query(() => String)
  test() {
    this.logger.verbose({ name: 'hello', test: 'test' });
    return 'hello';
  }
}
