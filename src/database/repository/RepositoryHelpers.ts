import { Repository } from 'typeorm';

import { BuildRepationsOptions } from './RepositoryHelpersTypes';

export class RepositoryHelpers<T> extends Repository<T> {
  //* Тут должны быть все филд ресолверы
  private readonly skipFields = new Set(['__typename', 'products_count']);

  /**
   * @description Срабатывает каждый раз при рекурсивном вызове buildRelations
   */
  private splitSelectsAndJoins(selections: any[]) {
    const toJoin: any[] = [];
    const toSelect: any[] = [];

    for (let i = 0; i < selections.length; i++) {
      const s = selections[i];

      if (this.skipFields.has(s.name.value)) continue;

      if (!s.selectionSet) toSelect.push(s);
      else toJoin.push(s);
    }

    return { toJoin, toSelect };
  }

  protected buildRelations({
    queryBuilder,
    selections,
    rootAlias,
    parentAlias,
  }: BuildRepationsOptions<T>) {
    if (!selections.length) {
      return queryBuilder;
    }

    try {
      const { toJoin, toSelect } = this.splitSelectsAndJoins(selections);

      if (!parentAlias && rootAlias) {
        if (toSelect) {
          queryBuilder.select(
            toSelect.map((s) => `${rootAlias}.${s.name.value}`),
          );
        }
        if (toJoin) {
          toJoin.forEach((j) => {
            if (j.name.value === '__typename') return;

            queryBuilder.leftJoin(`${rootAlias}.${j.name.value}`, j.name.value);

            this.buildRelations({
              queryBuilder,
              selections: j.selectionSet.selections,
              parentAlias: j.name.value,
            });
          });
        }
      }

      if (parentAlias && !rootAlias) {
        if (toSelect) {
          queryBuilder.addSelect(
            toSelect.map((s) => `${parentAlias}.${s.name.value}`),
          );
        }
        if (toJoin) {
          toJoin.forEach((j) => {
            if (j.name.value === '__typename') return;
            queryBuilder.leftJoin(
              `${parentAlias}.${j.name.value}`,
              j.name.value,
            );
            this.buildRelations({
              queryBuilder,
              selections: j.selectionSet.selections,
              parentAlias: j.name.value,
            });
          });
        }
      }

      return queryBuilder;
    } catch (err) {
      console.log('RepositoryHelpers.buildRelations: ', err);
    }
  }
}
