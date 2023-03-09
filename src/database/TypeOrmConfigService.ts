import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { Config } from './../config';
import {
  ProductEntity,
  UserEntity,
  OrderEntity,
  TransactionEntity,
  ContactEntity,
  CategoryEntity,
} from './entities';

// import { MyView } from './entities/View';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const deployEnv = this.configService.get(Config.DEPLOY_ENV);
    const migrations = [path.join(__dirname, './migrations/*')];
    const entities = [
      ProductEntity,
      UserEntity,
      OrderEntity,
      TransactionEntity,
      ContactEntity,
      CategoryEntity,
      // MyView,
    ];

    return {
      type: 'postgres',
      url: this.configService.get(Config.POSTGRES_URL),
      name: 'default',
      // host: process.env.POSTGRES_HOST, // Читай за этот параметр в INFO -> Config
      // database: process.env.POSTGRES_DB,
      // username: process.env.POSTGRES_USER,
      // password: process.env.POSTGRES_PASSWORD,
      logging: !(deployEnv === 'TEST'),
      synchronize: !(deployEnv === 'TEST'),
      migrations: migrations,
      entities: entities,
      uuidExtension: 'pgcrypto',
      // Пример своего собственного кэша. Для этого нужно реализовывать свой класс CacheProvider
      //   provider(connection) {
      //     console.log('connection', connection);
      //     return new CacheProvider(connection);
      //   },
      // cache: process.env.DEPLOY_ENV === 'development' ? redisConfig : false,
      ssl: deployEnv === 'development' ? false : { rejectUnauthorized: true },
    };
  }
}
