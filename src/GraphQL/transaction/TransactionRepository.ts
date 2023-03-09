import { EntityRepository, getManager } from 'typeorm';

import { TransactionEntity } from '@root/database/entities';
import { RepositoryHelpers } from '@root/database/repository/RepositoryHelpers';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

@EntityRepository(TransactionEntity)
export class TransactionRepository extends RepositoryHelpers<TransactionEntity> {
  async deepSelectMany({
    selections,
    rootAlias,
    page,
    limit,
    orderBy,
  }: SelectOptions): Promise<any> {
    const queryBuilder = getManager()
      .getRepository(TransactionEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({ queryBuilder, selections, rootAlias });

    query.orderBy(`${rootAlias}.${orderBy}`, 'DESC');

    if (page !== 0 && limit !== 0) {
      query.skip((page - 1) * limit);
    }

    if (limit !== 0) {
      query.take(limit);
    }

    const result = await query.getManyAndCount();

    return result;
  }

  async deepSelect({ rootAlias, selections, id }: SelectOptions) {
    const queryBuilder = getManager()
      .getRepository(TransactionEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({
      queryBuilder,
      selections,
      rootAlias,
    });

    query.where(`${rootAlias}.id = :id`, { id });

    const result = await query.getOne();

    return result;
  }
}
