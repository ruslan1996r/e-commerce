import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { TransactionService } from './TransactionService';
import {
  GraphSelection,
  GraphSelections,
} from '@root/shared/decorators/GraphSelection';
import { TransactionsOutput } from './TransactionTypes';
import { TransactionEntity } from '@root/database/entities';
@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionsOutput)
  getTransactions(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args({ name: 'orderBy', type: () => String, defaultValue: 'id' })
    orderBy: string,
    @GraphSelection({ root: 'transactions' }) selections: GraphSelections[],
  ) {
    return this.transactionService.getTransactions({
      page,
      limit,
      orderBy,
      selections,
    });
  }

  @Query(() => TransactionEntity, { nullable: true })
  getTransaction(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GraphSelection() selections: GraphSelections[],
  ) {
    return this.transactionService.getTransaction(id, selections);
  }
}
