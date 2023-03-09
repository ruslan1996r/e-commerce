import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DeliveryResolver } from './DeliveryResolver';
import { DeliveryService } from './DeliveryService';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.NOVA_POSHTA_URL,
    }),
  ],
  providers: [DeliveryResolver, DeliveryService],
})
export class DeliveryModule {}
