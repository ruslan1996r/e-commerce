import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductEntity } from './';

// parent_1 -> parent_2 -> root_cat -> sub_cats

@ObjectType()
@Entity({ name: 'category' })
export class CategoryEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column({ default: 1 })
  level: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  parent_id: number;

  @Field(() => [ProductEntity])
  @OneToMany(() => ProductEntity, (product) => product.category, {
    nullable: true,
  })
  @JoinTable({ name: 'category_products' })
  products: ProductEntity[];

  @Field(() => [CategoryEntity], { nullable: true })
  @ManyToMany(() => CategoryEntity, (category) => category.id, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'category_parents' })
  parents: CategoryEntity[];

  @Field(() => [CategoryEntity], { nullable: true })
  @ManyToMany(() => CategoryEntity, (category) => category.id, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'category_sub' })
  sub_categories: CategoryEntity[];
}
