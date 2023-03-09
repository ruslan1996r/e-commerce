import { SelectQueryBuilder } from 'typeorm';

type Id = string | number;

export type SelectOptions = {
  id?: Id;
  selections: any[];
  rootAlias: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  conditions?: { [key: string]: any };
};

export type BuildRepationsOptions<T> = {
  queryBuilder: SelectQueryBuilder<T>;
  selections: any[];
  parentAlias?: string;
  rootAlias?: string;
};
