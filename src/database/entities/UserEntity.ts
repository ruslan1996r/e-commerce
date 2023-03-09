import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContactEntity } from './ContactEntity';
import { OrderEntity } from './OrderEntity';

export enum AuthType {
  local = 'local',
  google = 'google',
  none = 'none',
}

export enum UserType {
  customer = 'customer',
  admin = 'admin',
  guest = 'guest',
}

@ObjectType()
@Entity({ name: 'user' })
export class UserEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  surname?: string;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  network_id?: string;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  picture?: string;

  @Field(() => String)
  @Column({ default: AuthType.none })
  auth_type?: AuthType;

  @Column({ default: null })
  password?: string;
  @Column({ default: UserType.customer })
  user_type?: UserType;

  @Field(() => [OrderEntity], { nullable: true })
  @OneToMany(() => OrderEntity, (order) => order.user)
  orders?: OrderEntity[];

  @Field(() => ContactEntity, { nullable: true })
  @OneToOne(() => ContactEntity, (contact) => contact.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'contact_id' })
  contact_info?: ContactEntity;
}
