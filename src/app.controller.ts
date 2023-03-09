import { TransactionService } from './GraphQL/transaction/TransactionService';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';

import { OrderService } from './GraphQL/order/OrderService';
import { OrderIput } from './GraphQL/order/OrderTypes';
// import { UserGuard } from './guards/UserGuard(rest)';

/**
 * @deprecated Этот класс не будет использоваться в дальнейшем. Его нужно удалить
 */
@Controller('/rest')
export class AppController {
  constructor(
    private orderService: OrderService,
    private transactionService: TransactionService,
  ) {}
  @Get('/delivery')
  async ordService() {
    // TODO: replace test data

    const userInfo_2 = {
      name: 'test@gmail.com',
      surname: 'TestUser',
      email: 'test@gmail.com',
      // id: 21,
    };
    const order: OrderIput = {
      productsIds: [
        '595b096b-6518-44d1-94aa-f14d0619f0d9',
        'b7bc5109-d89d-47bf-ac14-04d09e1abdab',
      ],
      contactInfo: {
        region: 'Винницкая обл.',
        city: 'Винница',
        warehouse: '16 Отдел. Коцюб',
        phone: 123,
      },
      userInfo: userInfo_2,
    };
    const result = await this.orderService.createOrder(order);
    console.log('result', result);
    return result;
  }

  @Get('/trans/:orderId')
  async trans(@Param('orderId') orderId: string): Promise<boolean> {
    const res = await this.transactionService.verifyTransaction(orderId);
    // console.log('verifyTransaction_Controller', res);
    return res;
  }

  @Get('/authOnly')
  // @UseGuards(UserGuard)
  // @UsePipes(ValidationPipe)
  async test() {
    return {
      authOnly: 'authOnly',
    };
  }

  @Get('/test')
  // @UseGuards(UserGuard)
  // @UsePipes(ValidationPipe)
  tt() {
    return {
      test: 'test_work123_SECRETS_stg',
    };
  }
}
