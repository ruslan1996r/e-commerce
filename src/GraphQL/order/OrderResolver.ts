import { Logger } from '@nestjs/common';
import {
  Mutation,
  ObjectType,
  Resolver,
  Field,
  Query,
  Args,
  Int,
} from '@nestjs/graphql';

import { OrderEntity } from '@root/database/entities';
import {
  GraphSelection,
  GraphSelections,
} from '@root/shared/decorators/GraphSelection';
import { OrderService } from './OrderService';
import { OrdersOutput } from './OrderTypes';

@ObjectType()
class Test {
  @Field(() => String)
  test: string;
}

@Resolver()
export class OrderResolver {
  private readonly logger: Logger = new Logger(OrderResolver.name);
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Test)
  createTransaction() {
    // const data: any = {};
    // return this.orderService.createTransaction(data);
    return { test: '' };
  }

  @Mutation(() => Test)
  verifyOrder() {
    // return this.orderService.verifyOrder()
  }

  @Mutation(() => OrderEntity)
  createOrder() {
    return this.orderService.createORDER();
  }

  @Query(() => OrdersOutput)
  async getOrders(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args({ name: 'orderBy', type: () => String, defaultValue: 'created_at' })
    orderBy: string,
    @GraphSelection({ root: 'orders' }) selections: GraphSelections[],
  ) {
    return this.orderService.getOrders({
      page,
      limit,
      orderBy,
      selections,
    });
  }

  @Query(() => OrderEntity, { nullable: true })
  getOrder(
    @Args({ name: 'id', type: () => String }) id: string,
    @GraphSelection() selections: GraphSelections[],
  ) {
    return this.orderService.getOrder(id, selections);
  }

  @Mutation(() => Boolean)
  deleteOrders() {
    return this.orderService.deleteOrders();
  }
}
