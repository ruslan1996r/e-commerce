import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderEntity, ProductEntity } from '@root/database/entities';
import { OrderIput } from './OrderTypes';
import { AuthService } from '../auth/AuthService';
import { TransactionService } from '../transaction/TransactionService';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';
import { OrderRepository } from './OrderRepository';

@Injectable()
export class OrderService {
  private readonly logger: Logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private authService: AuthService,
    private transactionService: TransactionService,
    private customOrderRepository: OrderRepository,
  ) {}

  async getOrders({ page, limit, orderBy, selections }) {
    const selectOptions: SelectOptions = {
      selections,
      rootAlias: 'orders',
      page,
      limit,
      orderBy,
    };

    const [orders, total] = await this.customOrderRepository.deepSelectMany(
      selectOptions,
    );

    return { total, orders };
  }

  async getOrder(orderId: string, selections: any) {
    return this.customOrderRepository.deepSelect({
      rootAlias: 'order',
      selections,
      id: orderId,
    });
  }

  async createORDER() {
    return this.orderRepository.save({});
  }

  async deleteOrders() {
    await this.orderRepository.delete({});
  }

  // ? Лучшим решением будет скидывать сюда контактные данные только в случае, если они изменились.
  // ? Если нет, просто получи их из юзера

  async createOrder(order: OrderIput) {
    try {
      const t1 = new Date().getTime();

      const { productsIds, contactInfo, userInfo } = order;

      // Если такой юзер уже существует, есть вероятность, что он может обновить свои данные
      const { user, contact_info } = await this.authService.updateContactInfo(
        contactInfo,
        userInfo,
      );

      const products = await this.productRepository.find({
        id: In(productsIds),
      });

      const newOrder: OrderEntity = await this.orderRepository.save({
        products,
        user: user,
        contact_info: contact_info,
      });

      console.log('newOrder', newOrder);

      const transactionParams = {
        order_id: newOrder.id,
        price: products.reduce((summ, product) => summ + product.price, 0),
      };

      const transactionForm = await this.transactionService.createTransaction(
        transactionParams,
      );

      const t2 = new Date().getTime();

      this.logger.log(`Transaction closed for (${t2 - t1}) ms`);

      return transactionForm;
    } catch (err) {
      this.logger.error(err, 'Transaction Error');
    }
  }
}
