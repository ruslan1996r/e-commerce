import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderResolver } from './OrderResolver';
import { OrderService } from './OrderService';
import {
  UserEntity,
  TransactionEntity,
  OrderEntity,
  ProductEntity,
} from '@root/database/entities';
import { AuthModule } from '../auth/AuthModule';
import { TransactionModule } from './../transaction/TransactionModule';
import { OrderRepository } from './OrderRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      OrderEntity,
      TransactionEntity,
      UserEntity,
    ]),
    AuthModule,
    TransactionModule,
  ],
  exports: [OrderService],
  providers: [
    OrderResolver,
    ConfigService,
    OrderService,
    OrderRepository,
    // {
    //   provide: LIQPAY_SERVICE,
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return new LiqPayService(
    //       configService.get(Config.PAYMENT_PUBLIC_KEY),
    //       configService.get(Config.PAYMENT_SECRET_KEY),
    //     );
    //   },
    // },
  ],
})
export class OrderModule {}
