import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoryEntity } from './CategoryEntity';
import { OrderEntity } from './OrderEntity';

// TODO: Category, Colors, SEO tags

const mockLink =
  'https://images.ctfassets.net/23aumh6u8s0i/7dRRpqkgQsuoZfqK47sAFj/15ea762a924d8164cee9ee22d6fc83f8/graphql';

@ObjectType()
@Entity({ name: 'product' })
export class ProductEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  discount: number;

  @Field(() => String)
  @Column({ default: mockLink })
  cover_image: string;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  images: string[];

  @Field(() => [OrderEntity], { nullable: true })
  @ManyToMany(() => OrderEntity, (order) => order.products)
  orders?: OrderEntity[];

  @Field(() => CategoryEntity, { nullable: true })
  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: true,
    cascade: true,
  })
  category?: CategoryEntity;

  @Field(() => String)
  @CreateDateColumn()
  created_at?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at?: Date;
}
