import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config } from '@root/config';
import { LIQPAY_SERVICE } from '@root/constants';
import { TransactionService } from './TransactionService';
import { TransactionResolver } from './TransactionResolver';
import { LiqPayService } from './LiqPayService';
import { OrderEntity, TransactionEntity } from '@root/database/entities';
import { TransactionRepository } from './TransactionRepository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, TransactionEntity])],
  exports: [TransactionService],
  providers: [
    TransactionService,
    TransactionResolver,
    TransactionRepository,
    ConfigService,
    {
      provide: LIQPAY_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new LiqPayService(
          configService.get(Config.PAYMENT_PUBLIC_KEY),
          configService.get(Config.PAYMENT_SECRET_KEY),
        );
      },
    },
  ],
})
export class TransactionModule {}
