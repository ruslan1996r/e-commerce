import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, IsArray } from 'class-validator';

import { ContactInfoInput, UserOrderInput } from '../auth/AuthTypes';
import { OrderEntity } from '@root/database/entities';

@InputType()
export class OrderIput {
  @Field(() => [String])
  @IsString({ each: true })
  @IsArray()
  productsIds: any[]; //string[];

  @Field(() => ContactInfoInput)
  contactInfo: ContactInfoInput;

  @Field(() => UserOrderInput)
  userInfo: UserOrderInput;
}

@ObjectType()
export class OrdersOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [OrderEntity])
  orders: OrderEntity[];
}
