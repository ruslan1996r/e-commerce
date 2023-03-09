import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';

import { CategoryEntity } from '@root/database/entities';

@InputType()
export class CategoryConditions {
  @Field(() => Int, { nullable: true })
  level?: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}

@InputType()
export class CategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  level?: number;
}

@ObjectType()
export class CategoryOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [CategoryEntity])
  categories: CategoryEntity[];
}
