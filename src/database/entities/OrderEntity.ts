import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactEntity } from './ContactEntity';
import { ProductEntity } from './ProductEntity';
import { TransactionEntity } from './TransactionEntity';
import { UserEntity } from './UserEntity';

export enum OrderStatus {
  success = 'confirmed',
  pending = 'pending',
  canceled = 'canceled',
}

@ObjectType()
@Entity({ name: 'order' })
export class OrderEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => [ProductEntity], { nullable: true })
  @ManyToMany(() => ProductEntity, (product) => product.orders)
  @JoinTable({ name: 'order_product' }) // В соотношении ManyToMany это обязательное свойство
  products: ProductEntity[];

  @Field(() => String)
  @Column('enum', { enum: OrderStatus, default: OrderStatus.pending })
  status: OrderStatus;

  @Field(() => TransactionEntity, { nullable: true })
  @OneToOne(() => TransactionEntity, (transaction) => transaction.order)
  @JoinColumn({ name: 'transaction_id' })
  transaction?: TransactionEntity;

  @Field(() => UserEntity, { nullable: true })
  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Field(() => ContactEntity, { nullable: true })
  @ManyToOne(() => ContactEntity, (contact) => contact.orders, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    // cascade: true,
  })
  @JoinColumn({ name: 'contact_id' })
  contact_info: ContactEntity;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
