import { EntityRepository, getManager } from 'typeorm';

import { ProductEntity } from '@root/database/entities';
import { RepositoryHelpers } from '@root/database/repository/RepositoryHelpers';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

// https://www.youtube.com/watch?v=e1cbhZ5vDGc&ab_channel=BenAwad

@EntityRepository(ProductEntity)
export class ProductRepository extends RepositoryHelpers<ProductEntity> {
  async deepSelect({
    selections,
    rootAlias,
    page,
    limit,
    orderBy,
    conditions,
  }: SelectOptions): Promise<any[]> {
    const queryBuilder = getManager()
      .getRepository(ProductEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({
      queryBuilder,
      selections,
      rootAlias,
    });

    query.orderBy(`${rootAlias}.${orderBy}`, 'DESC');

    if (conditions && Object.keys(conditions).length) {
      query.where(`${rootAlias}.price = :price`, { price: conditions.price });

      if (conditions.discount) {
        query.andWhere(`${rootAlias}.discount = :discount`, {
          discount: conditions.discount,
        });
      }
    }

    // Я перешёл на skip + take по причине, что offset и limit являются частью запроса и могут некорректно работать с joins
    if (page !== 0 && limit !== 0) {
      query.skip((page - 1) * limit); // offset
    }

    if (limit !== 0) {
      query.take(limit); // limit
    }

    const result = await query.getManyAndCount();

    return result;
  }
}
