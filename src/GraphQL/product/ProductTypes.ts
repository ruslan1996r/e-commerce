import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';

import { ProductEntity } from '@root/database/entities';

@InputType()
export class ProductInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  discount: number;

  @Field(() => Int, { nullable: true })
  category_id: number;

  @Field(() => String)
  cover_image: string;

  @Field(() => [String])
  images: string[];
}

@ObjectType()
export class ProductsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [ProductEntity])
  products: ProductEntity[];
}

@InputType()
export class ProductConditions {
  @Field(() => Int, { nullable: true })
  price: number;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int, { nullable: true })
  discount: number;
}
