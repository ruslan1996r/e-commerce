import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './OrderEntity';
import { UserEntity } from './UserEntity';

@ObjectType()
@Entity({ name: 'contact' })
export class ContactEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column()
  region?: string;

  @Field(() => String, { nullable: true })
  @Column()
  city?: string;

  @Field(() => String, { nullable: true })
  @Column()
  warehouse?: string;

  @Field(() => Int, { nullable: true })
  @Column()
  phone?: number;

  @OneToMany(() => OrderEntity, (order) => order.contact_info)
  orders?: OrderEntity[];

  @OneToOne(() => UserEntity, (user) => user.contact_info)
  user?: UserEntity;
}
