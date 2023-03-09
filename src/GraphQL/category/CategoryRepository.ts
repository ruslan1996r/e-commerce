import { EntityRepository, getManager } from 'typeorm';

import { CategoryEntity } from '@root/database/entities';
import { RepositoryHelpers } from '@root/database/repository/RepositoryHelpers';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

// ?: возможно, вынести репозиторий в какой-то один общий файл, чтобы не дублировалась логика

@EntityRepository(CategoryEntity)
export class CategoryRepository extends RepositoryHelpers<CategoryEntity> {
  async deepSelect({
    selections,
    rootAlias,
    page,
    limit,
    orderBy,
    conditions,
  }: SelectOptions): Promise<any[]> {
    const queryBuilder = getManager()
      .getRepository(CategoryEntity)
      .createQueryBuilder(rootAlias);

    const query = this.buildRelations({
      queryBuilder,
      selections,
      rootAlias,
    });

    if (conditions) {
      if (conditions.level) {
        query.where(`${rootAlias}.level = :level`, { level: conditions.level });
      }
      if (conditions.parentId) {
        query.where(`${rootAlias}.parent_id = :parentId`, {
          parentId: conditions.parentId,
        });
      }
    }

    if (orderBy) {
      query.orderBy(`${rootAlias}.${orderBy}`, 'ASC');
    }

    if (page !== 0 && limit !== 0) {
      query.skip((page - 1) * limit);
    }

    if (limit !== 0) {
      query.take(limit);
    }

    const result = await query.getManyAndCount();

    return result;
  }
}
