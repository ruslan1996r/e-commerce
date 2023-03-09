import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LIQPAY_SERVICE } from '@root/constants';
import { OrderEntity, TransactionEntity } from '@root/database/entities';
import { TransactionStatus } from '@root/database/entities/TransactionEntity';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';
import { Transaction, TransactionParams } from './TransactionTypes';
import { LiqPayService } from './LiqPayService';
import { TransactionRepository } from './TransactionRepository';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);
  constructor(
    @Inject(LIQPAY_SERVICE) private liqPay: LiqPayService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private customTransactionRepository: TransactionRepository,
  ) {}

  async getTransaction(transactionId: number, selections: any) {
    return this.customTransactionRepository.deepSelect({
      rootAlias: 'transaction',
      selections,
      id: transactionId,
    });
  }

  async getTransactions({ page, limit, orderBy, selections }) {
    const selectOptions: SelectOptions = {
      selections,
      rootAlias: 'transactions',
      page,
      limit,
      orderBy,
    };

    const [transactions, total] =
      await this.customTransactionRepository.deepSelectMany(selectOptions);

    return { transactions, total };
  }

  async createTransaction(order: TransactionParams) {
    try {
      const { order_id, price } = order;
      const { data, signature } = await this.liqPay.liqForm({
        action: 'pay',
        amount: price,
        currency: 'UAH',
        description: 'Small shop',
        order_id: order_id,
        version: '3',
      });

      return {
        data,
        signature,
        order_id: order_id,
        price: price,
      };
    } catch (error) {
      this.logger.error(error, 'CreateTransaction');
    }
  }

  async verifyTransaction(orderId: string): Promise<boolean> {
    const transaction: Transaction = await this.liqPay.liqPayApi('request', {
      action: 'status',
      version: '3',
      order_id: orderId,
    });

    const transactionProps = {
      id: transaction.transaction_id,
      commission: transaction.receiver_commission,
      amount: transaction.amount,
      status: TransactionStatus[transaction.status],
      order: await this.orderRepository.findOne({ id: orderId }),
    };

    const createdTransaction = await this.transactionRepository.save(
      transactionProps,
    );

    //* Добавить в созданный заказ полученную транзакцию
    await this.orderRepository.save({
      id: orderId,
      transaction: createdTransaction,
    });

    if (transaction.status === 'success') {
      this.logger.log(transaction.transaction_id, 'Transaction Success ID');
      return true;
    }

    this.logger.error(transaction.transaction_id, 'Transaction Error ID');
    return false;
  }
}
