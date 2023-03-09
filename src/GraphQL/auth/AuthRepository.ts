import { EntityRepository, getManager } from 'typeorm';

import { UserEntity } from '@root/database/entities';
import { RepositoryHelpers } from '@root/database/repository/RepositoryHelpers';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

// ?: возможно, вынести репозиторий в какой-то один общий файл, чтобы не дублировалась логика

@EntityRepository(UserEntity)
export class AuthRepository extends RepositoryHelpers<UserEntity> {
  async deepSelectMany({
    selections,
    rootAlias,
    page,
    limit,
    orderBy,
  }: SelectOptions): Promise<any[]> {
    const queryBuilder = getManager()
      .getRepository(UserEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({
      queryBuilder,
      selections,
      rootAlias,
    });

    if (page !== 0 && limit !== 0) {
      // query.offset((page - 1) * limit);
      query.skip((page - 1) * limit);
    }

    if (limit !== 0) {
      // query.take(limit);
      query.take(limit);
    }

    query.orderBy(`${rootAlias}.${orderBy}`, 'ASC');

    const result = await query.getMany();

    return result;
  }

  async deepSelect({ rootAlias, selections, id }: SelectOptions): Promise<any> {
    const queryBuilder = getManager()
      .getRepository(UserEntity)
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
