import { EntityRepository, getManager } from 'typeorm';

import { OrderEntity } from '@root/database/entities';
import { RepositoryHelpers } from '@root/database/repository/RepositoryHelpers';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

// ?: возможно, вынести репозиторий в какой-то один общий файл, чтобы не дублировалась логика

@EntityRepository(OrderEntity)
export class OrderRepository extends RepositoryHelpers<OrderEntity> {
  async deepSelectMany({
    selections,
    rootAlias,
    page,
    limit,
    orderBy,
  }: SelectOptions): Promise<any[]> {
    const queryBuilder = getManager()
      .getRepository(OrderEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({
      queryBuilder,
      selections,
      rootAlias,
    });

    query.orderBy(`${rootAlias}.${orderBy}`, 'DESC');

    if (page !== 0 && limit !== 0) {
      // query.offset((page - 1) * limit);
      query.skip((page - 1) * limit);
    }

    if (limit !== 0) {
      // query.limit(limit);
      query.take(limit);
    }

    const result = await query.getManyAndCount();

    return result;
  }

  async deepSelect({ selections, rootAlias, id }: SelectOptions): Promise<any> {
    const queryBuilder = getManager()
      .getRepository(OrderEntity)
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
