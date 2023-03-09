import { TransactionModule } from './transaction/TransactionModule';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/AuthModule';
import { CategoryModule } from './category/CategoryModule';
import { DeliveryModule } from './delivery/DeliveryModule';
import { OrderModule } from './order/OrderModule';

import { ProductModule } from './product/ProductModule';

@Module({
  imports: [
    ProductModule,
    AuthModule,
    DeliveryModule,
    OrderModule,
    CategoryModule,
    TransactionModule,
  ],
})
export class ResolverModule {}
