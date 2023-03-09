import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { OrderEntity } from './OrderEntity';

export enum TransactionStatus {
  success = 'success',
  error = 'error',
}

@ObjectType()
@Entity({ name: 'transaction' })
export class TransactionEntity {
  @Field(() => Int)
  @PrimaryColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'float4' })
  commission: number;

  @Field(() => Float)
  @Column({ type: 'float4' })
  amount: number;

  @Field(() => String)
  @Column()
  status: TransactionStatus;

  @Field(() => OrderEntity, { nullable: true })
  @OneToOne(() => OrderEntity, (order) => order.transaction)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
